import { isSupabaseConfigured, supabase } from "@/services/supabase";
import type { SupabaseJson } from "@/types/database";
import type {
  Profile,
  SupportContactPreference,
  SupportMessage,
  SupportTicket,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus
} from "@/types/domain";

const SUPPORT_TICKETS_STORAGE_KEY = "rider-demo-support-tickets";
const SUPPORT_MESSAGES_STORAGE_KEY = "rider-demo-support-messages";
const SUPPORT_UPDATED_EVENT = "rider-support-updated";

export type CreateSupportTicketValues = {
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  subject: string;
  description: string;
  contactPreference: SupportContactPreference;
  relatedBookingId?: string;
  relatedRoadsideRequestId?: string;
  relatedVehicleId?: string;
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

function emitSupportUpdated(ticketId?: string) {
  window.dispatchEvent(new CustomEvent(SUPPORT_UPDATED_EVENT, { detail: { ticketId } }));
}

function readDemoTickets() {
  const tickets = readStorage<SupportTicket[]>(SUPPORT_TICKETS_STORAGE_KEY, []);

  if (tickets.length > 0) {
    return tickets;
  }

  const now = new Date().toISOString();
  const seeded: SupportTicket[] = [
    {
      id: "support-demo-payment",
      createdBy: "demo-customer",
      createdByName: "Client Demo",
      createdByRole: "client",
      assignedToName: "Suport Rider",
      category: "payment",
      priority: "normal",
      status: "waiting_for_support",
      subject: "Verificare plată cash",
      description: "Clientul cere confirmarea sumei încasate la finalul cursei.",
      contactPreference: "in_app",
      unreadCount: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: "support-demo-sla",
      createdBy: "demo-fleet-manager",
      createdByName: "Fleet Manager Demo",
      createdByRole: "fleet_manager",
      assignedToName: "Suport Rider",
      category: "fleet",
      priority: "high",
      status: "in_review",
      subject: "SLA rapid aproape ratat",
      description: "Solicitare roadside rapidă cu risc de depășire a garanției de 30 minute.",
      contactPreference: "in_app",
      unreadCount: 0,
      createdAt: now,
      updatedAt: now
    }
  ];

  writeStorage(SUPPORT_TICKETS_STORAGE_KEY, seeded);
  writeStorage(SUPPORT_MESSAGES_STORAGE_KEY, [
    {
      id: createId("support-msg"),
      ticketId: "support-demo-payment",
      senderName: "Suport Rider",
      senderRole: "support_agent",
      body: "Am preluat ticketul. Verificăm cursa și metoda de plată.",
      createdAt: now
    },
    {
      id: createId("support-msg"),
      ticketId: "support-demo-sla",
      senderName: "Suport Rider",
      senderRole: "support_agent",
      body: "Am marcat solicitarea pentru monitorizare SLA.",
      createdAt: now
    }
  ] satisfies SupportMessage[]);

  return seeded;
}

function writeDemoTickets(tickets: SupportTicket[]) {
  writeStorage(SUPPORT_TICKETS_STORAGE_KEY, tickets);
}

function readDemoMessages() {
  return readStorage<SupportMessage[]>(SUPPORT_MESSAGES_STORAGE_KEY, []);
}

function writeDemoMessages(messages: SupportMessage[]) {
  writeStorage(SUPPORT_MESSAGES_STORAGE_KEY, messages);
}

export async function createSupportTicket(values: CreateSupportTicketValues, profile?: Profile | null) {
  const now = new Date().toISOString();

  if (isDemoProfile(profile)) {
    const ticket: SupportTicket = {
      id: createId("support"),
      createdBy: profile?.id || "demo-user",
      createdByName: profile?.fullName || "Utilizator Demo",
      createdByRole: profile?.role || "client",
      category: values.category,
      priority: values.priority,
      status: "waiting_for_support",
      subject: values.subject,
      description: values.description,
      contactPreference: values.contactPreference,
      relatedBookingId: values.relatedBookingId,
      relatedRoadsideRequestId: values.relatedRoadsideRequestId,
      relatedVehicleId: values.relatedVehicleId,
      unreadCount: 0,
      createdAt: now,
      updatedAt: now
    };
    writeDemoTickets([ticket, ...readDemoTickets()]);
    writeDemoMessages([
      ...readDemoMessages(),
      {
        id: createId("support-msg"),
        ticketId: ticket.id,
        senderId: profile?.id,
        senderName: profile?.fullName || "Utilizator Demo",
        senderRole: profile?.role || "client",
        body: values.description,
        createdAt: now
      }
    ]);
    window.setTimeout(() => {
      writeDemoMessages([
        ...readDemoMessages(),
        {
          id: createId("support-msg"),
          ticketId: ticket.id,
          senderName: "Suport Rider",
          senderRole: "support_agent",
          body: "Am primit solicitarea. Revenim aici cu actualizări.",
          createdAt: new Date().toISOString()
        }
      ]);
      emitSupportUpdated(ticket.id);
    }, 900);
    emitSupportUpdated(ticket.id);
    return ticket;
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      created_by: profile?.id || "",
      category: values.category,
      priority: values.priority,
      subject: values.subject,
      description: values.description,
      contact_preference: values.contactPreference,
      related_booking_id: values.relatedBookingId,
      related_roadside_request_id: values.relatedRoadsideRequestId,
      related_vehicle_id: values.relatedVehicleId
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseTicket(data, profile);
}

export async function getSupportTicketsForCurrentUser(profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    const tickets = readDemoTickets();
    if (profile?.role === "admin") {
      return tickets;
    }

    if (profile?.role === "fleet_manager") {
      return tickets.filter((ticket) => ticket.createdBy === profile.id || ticket.category === "fleet");
    }

    return tickets.filter((ticket) => ticket.createdBy === profile?.id || ticket.createdBy.startsWith("demo-"));
  }

  const query = supabase.from("support_tickets").select("*").order("updated_at", { ascending: false });
  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data.map((ticket) => mapSupabaseTicket(ticket, profile));
}

export async function getSupportTicket(ticketId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    return readDemoTickets().find((ticket) => ticket.id === ticketId) || readDemoTickets()[0];
  }

  const { data, error } = await supabase.from("support_tickets").select("*").eq("id", ticketId).single();

  if (error) {
    throw error;
  }

  return mapSupabaseTicket(data, profile);
}

export async function getSupportMessages(ticketId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    return readDemoMessages()
      .filter((message) => message.ticketId === ticketId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  const { data, error } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map((message) => mapSupabaseMessage(message, profile));
}

export async function replyToSupportTicket(ticketId: string, body: string, profile?: Profile | null, attachmentUrl?: string) {
  if (isDemoProfile(profile)) {
    const message: SupportMessage = {
      id: createId("support-msg"),
      ticketId,
      senderId: profile?.id,
      senderName: profile?.fullName || "Utilizator Demo",
      senderRole: profile?.role || "client",
      body,
      attachmentUrl,
      createdAt: new Date().toISOString()
    };
    writeDemoMessages([...readDemoMessages(), message]);
    writeDemoTickets(
      readDemoTickets().map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: "waiting_for_support", updatedAt: new Date().toISOString() } : ticket
      )
    );
    emitSupportUpdated(ticketId);
    return message;
  }

  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      ticket_id: ticketId,
      sender_id: profile?.id,
      body,
      attachment_url: attachmentUrl
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapSupabaseMessage(data, profile);
}

export function markSupportTicketResolved(ticketId: string, profile?: Profile | null) {
  return updateSupportTicketStatus(ticketId, "resolved", profile);
}

export function reopenSupportTicket(ticketId: string, profile?: Profile | null) {
  return updateSupportTicketStatus(ticketId, "open", profile);
}

export function closeSupportTicket(ticketId: string, profile?: Profile | null) {
  return updateSupportTicketStatus(ticketId, "closed", profile);
}

export async function assignSupportTicket(ticketId: string, assigneeId: string, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    writeDemoTickets(
      readDemoTickets().map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              assignedTo: assigneeId,
              assignedToName: "Admin Demo",
              status: "in_review",
              updatedAt: new Date().toISOString()
            }
          : ticket
      )
    );
    emitSupportUpdated(ticketId);
    return;
  }

  await supabase.from("support_tickets").update({ assigned_to: assigneeId, status: "in_review" }).eq("id", ticketId);
}

export async function updateSupportTicketStatus(ticketId: string, status: SupportTicketStatus, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    writeDemoTickets(
      readDemoTickets().map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status,
              updatedAt: new Date().toISOString()
            }
          : ticket
      )
    );
    emitSupportUpdated(ticketId);
    return;
  }

  await supabase.from("support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", ticketId);
}

export async function updateSupportTicketPriority(ticketId: string, priority: SupportTicketPriority, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    writeDemoTickets(
      readDemoTickets().map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              priority,
              updatedAt: new Date().toISOString()
            }
          : ticket
      )
    );
    emitSupportUpdated(ticketId);
    return;
  }

  await supabase.from("support_tickets").update({ priority, updated_at: new Date().toISOString() }).eq("id", ticketId);
}

export async function createSupportEvent(ticketId: string, eventType: string, payload: Record<string, unknown> = {}, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    emitSupportUpdated(ticketId);
    return {
      id: createId("support-event"),
      ticketId,
      actorId: profile?.id,
      eventType,
      payload,
      createdAt: new Date().toISOString()
    };
  }

  const { data, error } = await supabase
    .from("support_events")
    .insert({
      ticket_id: ticketId,
      actor_id: profile?.id,
      event_type: eventType,
      payload: payload as SupabaseJson
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    ticketId: data.ticket_id,
    actorId: data.actor_id || undefined,
    eventType: data.event_type,
    payload: typeof data.payload === "object" && data.payload ? (data.payload as Record<string, unknown>) : {},
    createdAt: data.created_at
  };
}

export function subscribeToSupportTicket(ticketId: string, callback: () => void, profile?: Profile | null) {
  if (isDemoProfile(profile)) {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<{ ticketId?: string }>;
      if (!customEvent.detail.ticketId || customEvent.detail.ticketId === ticketId) {
        callback();
      }
    };
    window.addEventListener(SUPPORT_UPDATED_EVENT, listener);
    return () => window.removeEventListener(SUPPORT_UPDATED_EVENT, listener);
  }

  const channel = supabase
    .channel(`support-ticket-${ticketId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "support_messages",
        filter: `ticket_id=eq.${ticketId}`
      },
      callback
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

type SupabaseSupportTicketRow = {
  id: string;
  created_by: string;
  assigned_to: string | null;
  related_booking_id: string | null;
  related_roadside_request_id: string | null;
  related_vehicle_id: string | null;
  category: string;
  priority: string;
  status: string;
  subject: string;
  description: string;
  contact_preference: string;
  created_at: string;
  updated_at: string;
};

type SupabaseSupportMessageRow = {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  body: string;
  attachment_url: string | null;
  internal_note: boolean;
  created_at: string;
};

function mapSupabaseTicket(row: SupabaseSupportTicketRow, profile?: Profile | null): SupportTicket {
  return {
    id: row.id,
    createdBy: row.created_by,
    createdByName: row.created_by === profile?.id ? profile.fullName : "Utilizator Rider",
    createdByRole: profile?.role || "client",
    assignedTo: row.assigned_to || undefined,
    assignedToName: row.assigned_to ? "Suport Rider" : undefined,
    relatedBookingId: row.related_booking_id || undefined,
    relatedRoadsideRequestId: row.related_roadside_request_id || undefined,
    relatedVehicleId: row.related_vehicle_id || undefined,
    category: row.category as SupportTicketCategory,
    priority: row.priority as SupportTicketPriority,
    status: row.status as SupportTicketStatus,
    subject: row.subject,
    description: row.description,
    contactPreference: row.contact_preference as SupportContactPreference,
    unreadCount: 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSupabaseMessage(row: SupabaseSupportMessageRow, profile?: Profile | null): SupportMessage {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    senderId: row.sender_id || undefined,
    senderName: row.sender_id === profile?.id ? profile.fullName : "Suport Rider",
    senderRole: row.sender_id === profile?.id ? profile.role : "support_agent",
    body: row.body,
    attachmentUrl: row.attachment_url || undefined,
    internalNote: row.internal_note,
    createdAt: row.created_at
  };
}
