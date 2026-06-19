import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type AssignDriverPayload = {
  bookingId: string;
  serviceType: string;
};

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL") || "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "");
  const payload = (await request.json()) as AssignDriverPayload;

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("driver_id")
    .eq("vehicle_type", payload.serviceType)
    .eq("status", "available")
    .limit(1)
    .single();

  if (vehicleError || !vehicle) {
    return Response.json({ assigned: false, reason: "no_driver_available" }, { status: 404 });
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      driver_id: vehicle.driver_id,
      status: "confirmed"
    })
    .eq("id", payload.bookingId);

  if (error) {
    return Response.json({ assigned: false, reason: error.message }, { status: 500 });
  }

  return Response.json({
    assigned: true,
    driverId: vehicle.driver_id
  });
});
