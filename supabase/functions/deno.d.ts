declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
}

declare module "https://esm.sh/@supabase/supabase-js@2.45.0" {
  export * from "@supabase/supabase-js";
}

declare module "https://deno.land/std@0.224.0/http/server.ts" {
  export type Handler = (request: Request) => Response | Promise<Response>;
  export function serve(handler: Handler): void;
}
