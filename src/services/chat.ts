import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type { SupabaseJson } from "@/types/database";
import type { AddressSuggestion, ChatMessage, ChatMessageType, ChatThread, Coordinates, Profile } from "@/types/domain";

const CHAT_THREADS_STORAGE_KEY = "rider-demo-chat-threads";
const CHAT_MESSAGES_STORAGE_KEY = "rider-demo-chat-messages";
const CHAT_UPDATED_EVENT = "rider-chat-updated";

type ChatUpdatedDetail = {
  threadId: string;
};

type SendChatMessageOptions = {
  messageType?: ChatMessageType;
  metadata?: Record<string, unknown>;
  attachmentUrl?: string;
  skipDemoReply?: boolean;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isDemoProfile(profile?: Profile | null) {
  return !profile || profile.id.startsWith("demo-") || !isSupabaseConfigured;
}

function emitChatUpdated(threadId: string) {
  window.dispatchEvent(new CustomEvent<ChatUpdatedDetail>(CHAT_UPDATED_EVENT, { detail: { threadId } }));
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readDemoThreads() {
  return readStorage<ChatThread[]>(CHAT_THREADS_STORAGE_KEY, []);
}

function writeDemoThreads(threads: ChatThread[]) {
  writeStorage(CHAT_THREADS_STORAGE_KEY, threads);
}

function readDemoMessages() {
  return readStorage<ChatMessage[]>(CHAT_MESSAGES_STORAGE_KEY, []);
}

function writeDemoMessages(messages: ChatMessage[]) {
  writeStorage(CHAT_MESSAGES_STORAGE_KEY, messages);
}

function getParticipantNames(threadType: ChatThread["threadType"], profile?: Profile | null) {
  const currentName = profile?.fullName || "Tu";

  if (threadType === "roadside") {
    return {
      currentName,
      otherName: profile?.role === "roadside_operator" ? "Client Demo" : "Operator Roadside Demo",
      otherRole: profile?.role === "roadside_operator" ? "client" : "roadside_operator"
    } as const;
  }

  if (threadType === "support") {
    return {
      currentName,
      otherName: "Suport Rider",
      otherRole: "support_agent"
    } as const;
  }

  return {
    currentName,
    otherName: profile?.role === "driver" ? "Client Demo" : "Șofer Demo",
    otherRole: profile?.role === "driver" ? "client" : "driver"
  } as const;
}

function createDemoThread(params: {
  id: string;
  threadType: ChatThread["threadType"];
  profile?: Profile | null;
  bookingId?: string;
  roadsideRequestId?: string;
  supportTicketId?: string;
}) {
  const now = new Date().toISOString();
  const names = getParticipantNames(params.threadType, params.profile);
  const thread: ChatThread = {
    id: params.id,
    threadType: params.threadType,
    status: "open",
    title: names.otherName,
    subtitle:
      params.threadType === "roadside"
        ? "Intervenție activă"
        : params.threadType === "support"
          ? "Ticket suport"
          : "Cursă activă",
    bookingId: params.bookingId,
    roadsideRequestId: params.roadsideRequestId,
    supportTicketId: params.supportTicketId,
    participants: [
      {
        id: `${params.id}-me`,
        threadId: params.id,
        userId: params.profile?.id || "demo-user",
        name: names.currentName,
        role: params.profile?.role || "client",
        lastReadAt: now
      },
      {
        id: `${params.id}-other`,
        threadId: params.id,
        userId: `${params.id}-other-user`,
        name: names.otherName,
        role: names.otherRole
      }
    ],
    unreadCount: 0,
    createdAt: now,
    updatedAt: now
  };

  const messages: ChatMessage[] = [
    {
      id: createId("msg"),
      threadId: params.id,
      senderName: "Rider",
      senderRole: "system",
      messageType: "system",
      body:
        params.threadType === "roadside"
          ? "Chat creat pentru intervenția roadside."
          : params.threadType === "support"
            ? "Chat creat pentru ticketul de suport."
            : `Chat creat pentru cursa ${params.bookingId ? `#${params.bookingId}` : "activă"}.`,
      createdAt: now,
      deliveredAt: now,
      readAt: now
    }
  ];

  return { thread, messages };
}

function upsertDemoThread(thread: ChatThread) {
  const threads = readDemoThreads();
  writeDemoThreads([thread, ...threads.filter((item) => item.id !== thread.id)]);
}

function appendDemoMessages(nextMessages: ChatMessage[]) {
  const messages = readDemoMessages();
  writeDemoMessages([...messages, ...nextMessages]);
  nextMessages.forEach((message) => emitChatUpdated(message.threadId));
}

async function getOrCreateDemoThread(params: {
  id: string;
  threadType: ChatThread["threadType"];
  profile?: Profile | null;
  bookingId?: string;
  roadsideRequestId?: string;
  supportTicketId?: string;
}) {
  const existing = readDemoThreads().find((thread) => thread.id === params.id);

  if (existing) {
    return existing;
  }

  const { thread, messages } = createDemoThread(params);
  upsertDemoThread(thread);
  appendDemoMessages(messages);
  return thread;
}

export async function getOrCreateRideChatThread(bookingId = "demo-booking-active", profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    return getOrCreateDemoThread({
      id: `ride-${bookingId}`,
      threadType: "ride",
      profile,
      bookingId
    });
  }

  const { data: existing, error: existingError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("booking_id", bookingId)
    .eq("thread_type", "ride")
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return mapSupabaseThread(existing, profile);
  }

  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ booking_id: bookingId, thread_type: "ride" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseThread(data, profile);
}

export async function getOrCreateRoadsideChatThread(roadsideRequestId = "demo-roadside-active", profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    return getOrCreateDemoThread({
      id: `roadside-${roadsideRequestId}`,
      threadType: "roadside",
      profile,
      roadsideRequestId
    });
  }

  const { data: existing, error: existingError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("roadside_request_id", roadsideRequestId)
    .eq("thread_type", "roadside")
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return mapSupabaseThread(existing, profile);
  }

  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ roadside_request_id: roadsideRequestId, thread_type: "roadside" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseThread(data, profile);
}

export async function getOrCreateSupportChatThread(supportTicketId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    return getOrCreateDemoThread({
      id: `support-${supportTicketId}`,
      threadType: "support",
      profile,
      supportTicketId
    });
  }

  const { data: existing, error: existingError } = await supabase
    .from("chat_threads")
    .select("*")
    .eq("support_ticket_id", supportTicketId)
    .eq("thread_type", "support")
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return mapSupabaseThread(existing, profile);
  }

  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ support_ticket_id: supportTicketId, thread_type: "support" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseThread(data, profile);
}

export async function getThread(threadId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    const thread = readDemoThreads().find((item) => item.id === threadId);
    if (thread) {
      return thread;
    }

    const threadType = threadId.startsWith("roadside-") ? "roadside" : threadId.startsWith("support-") ? "support" : "ride";
    return getOrCreateDemoThread({ id: threadId, threadType, profile });
  }

  const { data, error } = await supabase.from("chat_threads").select("*").eq("id", threadId).single();

  if (error) {
    throw error;
  }

  return mapSupabaseThread(data, profile);
}

export async function getThreadMessages(threadId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    return readDemoMessages()
      .filter((message) => message.threadId === threadId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map((message) => mapSupabaseMessage(message, profile));
}

export async function sendChatMessage(threadId: string, body: string, profile?: Profile | null, options: SendChatMessageOptions = {}) {
  const messageType = options.messageType || "text";

  if (isDemoProfile(profile)) {
    const now = new Date().toISOString();
    const message: ChatMessage = {
      id: createId("msg"),
      threadId,
      senderId: profile?.id,
      senderName: profile?.fullName || "Tu",
      senderRole: profile?.role || "client",
      messageType,
      body,
      metadata: options.metadata,
      attachmentUrl: options.attachmentUrl,
      createdAt: now,
      deliveredAt: now
    };

    appendDemoMessages([message]);

    if (messageType !== "system" && !options.skipDemoReply) {
      window.setTimeout(() => {
        const thread = readDemoThreads().find((item) => item.id === threadId);
        const isRoadside = thread?.threadType === "roadside";
        const reply: ChatMessage = {
          id: createId("msg"),
          threadId,
          senderName: isRoadside ? "Operator Roadside Demo" : "Șofer Demo",
          senderRole: isRoadside ? "roadside_operator" : "driver",
          messageType: "text",
          body: isRoadside
            ? "Te rog pornește avariile și stai într-un loc sigur. Sunt în drum spre tine."
            : "Sunt aproape de locația ta. Ajung în câteva minute.",
          createdAt: new Date().toISOString(),
          deliveredAt: new Date().toISOString()
        };
        appendDemoMessages([reply]);
      }, 900);
    }

    return message;
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      thread_id: threadId,
      sender_id: profile?.id,
      message_type: messageType,
      body,
      metadata: (options.metadata || {}) as SupabaseJson,
      attachment_url: options.attachmentUrl
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseMessage(data, profile);
}

export function sendSystemMessage(threadId: string, body: string, metadata?: Record<string, unknown>, profile?: Profile | null) {
  return sendChatMessage(threadId, body, profile, {
    messageType: "system",
    metadata,
    skipDemoReply: true
  });
}

export function sendLocationMessage(threadId: string, coordinates: Coordinates | AddressSuggestion, profile?: Profile | null) {
  const label = "Locație partajată";
  return sendChatMessage(threadId, label, profile, {
    messageType: "location",
    metadata: {
      lat: coordinates.lat,
      lng: coordinates.lng,
      label: "label" in coordinates ? coordinates.label : label
    }
  });
}

export async function markThreadRead(threadId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    const now = new Date().toISOString();
    const threads = readDemoThreads().map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            unreadCount: 0,
            participants: thread.participants.map((participant) =>
              participant.userId === (profile?.id || "demo-user")
                ? {
                    ...participant,
                    lastReadAt: now
                  }
                : participant
            )
          }
        : thread
    );
    writeDemoThreads(threads);
    emitChatUpdated(threadId);
    return;
  }

  await supabase
    .from("chat_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("thread_id", threadId)
    .eq("user_id", profile?.id || "");
}

export async function closeThread(threadId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    writeDemoThreads(readDemoThreads().map((thread) => (thread.id === threadId ? { ...thread, status: "closed" } : thread)));
    emitChatUpdated(threadId);
    return;
  }

  await supabase.from("chat_threads").update({ status: "closed" }).eq("id", threadId);
}

export async function getUnreadChatCountForUser(userId?: string) {
  if (!userId || userId.startsWith("demo-") || !isSupabaseConfigured) {
    return readDemoThreads().reduce((total, thread) => total + (thread.unreadCount || 0), 0);
  }

  const { data } = await supabase.from("chat_participants").select("thread_id,last_read_at").eq("user_id", userId);
  return data?.length || 0;
}

export function subscribeToThreadMessages(threadId: string, callback: (message: ChatMessage) => void, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    let previousIds = new Set(readDemoMessages().filter((message) => message.threadId === threadId).map((message) => message.id));
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<ChatUpdatedDetail>;
      if (customEvent.detail.threadId !== threadId) {
        return;
      }

      const messages = readDemoMessages().filter((message) => message.threadId === threadId);
      messages.forEach((message) => {
        if (!previousIds.has(message.id)) {
          callback(message);
        }
      });
      previousIds = new Set(messages.map((message) => message.id));
    };

    window.addEventListener(CHAT_UPDATED_EVENT, listener);
    return () => window.removeEventListener(CHAT_UPDATED_EVENT, listener);
  }

  const channel = supabase
    .channel(`chat-thread-${threadId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `thread_id=eq.${threadId}`
      },
      (payload) => callback(mapSupabaseMessage(payload.new as SupabaseChatMessageRow, profile))
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

type SupabaseChatThreadRow = {
  id: string;
  booking_id: string | null;
  roadside_request_id: string | null;
  support_ticket_id: string | null;
  thread_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type SupabaseChatMessageRow = {
  id: string;
  thread_id: string;
  sender_id: string | null;
  message_type: string;
  body: string | null;
  metadata: unknown;
  attachment_url: string | null;
  created_at: string;
};

function mapSupabaseThread(row: SupabaseChatThreadRow, profile?: Profile | null): ChatThread {
  const names = getParticipantNames(row.thread_type as ChatThread["threadType"], profile);
  return {
    id: row.id,
    threadType: row.thread_type as ChatThread["threadType"],
    status: row.status as ChatThread["status"],
    title: names.otherName,
    subtitle: row.thread_type === "roadside" ? "Intervenție activă" : row.thread_type === "support" ? "Ticket suport" : "Cursă activă",
    bookingId: row.booking_id || undefined,
    roadsideRequestId: row.roadside_request_id || undefined,
    supportTicketId: row.support_ticket_id || undefined,
    participants: [],
    unreadCount: 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSupabaseMessage(row: SupabaseChatMessageRow, profile?: Profile | null): ChatMessage {
  const fromCurrentUser = row.sender_id === profile?.id;
  return {
    id: row.id,
    threadId: row.thread_id,
    senderId: row.sender_id || undefined,
    senderName: fromCurrentUser ? profile?.fullName || "Tu" : "Rider",
    senderRole: fromCurrentUser ? profile?.role || "client" : "support_agent",
    messageType: row.message_type as ChatMessageType,
    body: row.body || undefined,
    metadata: typeof row.metadata === "object" && row.metadata ? (row.metadata as Record<string, unknown>) : undefined,
    attachmentUrl: row.attachment_url || undefined,
    createdAt: row.created_at
  };
}
