/// <reference path="../deno.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type DispatchPayload = {
  requestId: string;
};

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
  const payload = (await request.json()) as DispatchPayload;

  const { data: operator, error: operatorError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "roadside_operator")
    .limit(1)
    .single();

  if (operatorError || !operator) {
    return Response.json({ dispatched: false, reason: "no_operator_available" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("roadside_requests")
    .update({
      operator_id: operator.id,
      status: "accepted"
    })
    .eq("id", payload.requestId)
    .select()
    .single();

  if (error) {
    return Response.json({ dispatched: false, reason: error.message }, { status: 500 });
  }

  return Response.json({
    dispatched: true,
    request: data
  });
});
