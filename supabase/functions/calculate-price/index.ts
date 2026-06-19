import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type CalculatePricePayload = {
  distanceKm: number;
  durationMinutes: number;
  serviceType: "standard" | "premium" | "tow" | "roadside";
};

const basePrice = {
  standard: 9,
  premium: 18,
  tow: 110,
  roadside: 55
};

const multiplier = {
  standard: 2.15,
  premium: 3.65,
  tow: 5.25,
  roadside: 2.8
};

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = (await request.json()) as CalculatePricePayload;
  const price = Math.round(
    basePrice[payload.serviceType] + payload.distanceKm * multiplier[payload.serviceType] + payload.durationMinutes * 0.18
  );

  return Response.json({
    price,
    currency: "RON"
  });
});
