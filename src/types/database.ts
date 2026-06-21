import type { Json } from "./json";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          active_instance: string;
          fleet_scope: string | null;
          registration_status: string;
          theme: string;
          preferred_payment_method: string;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          language: string | null;
          default_address: string | null;
          home_address: string | null;
          work_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          active_instance?: string;
          fleet_scope?: string | null;
          registration_status?: string;
          theme?: string;
          preferred_payment_method?: string;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          language?: string | null;
          default_address?: string | null;
          home_address?: string | null;
          work_address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      driver_profiles: {
        Row: {
          id: string;
          user_id: string;
          license_number: string;
          license_expiry: string | null;
          experience_years: number;
          main_city: string | null;
          service_region: string | null;
          rating: number;
          total_rides: number;
          online: boolean;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          license_number: string;
          license_expiry?: string | null;
          experience_years?: number;
          main_city?: string | null;
          service_region?: string | null;
          rating?: number;
          total_rides?: number;
          online?: boolean;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_profiles"]["Insert"]>;
        Relationships: [];
      };
      roadside_operator_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          fiscal_code: string | null;
          dispatcher_phone: string | null;
          company_email: string | null;
          main_city: string | null;
          service_regions: string[];
          service_types: string[];
          online: boolean;
          rating: number;
          total_jobs: number;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string | null;
          fiscal_code?: string | null;
          dispatcher_phone?: string | null;
          company_email?: string | null;
          main_city?: string | null;
          service_regions?: string[];
          service_types?: string[];
          online?: boolean;
          rating?: number;
          total_jobs?: number;
          approved_at?: string | null;
          approved_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadside_operator_profiles"]["Insert"]>;
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address: string;
          lat: number;
          lng: number;
          source: string;
          accuracy_meters: number | null;
          raw_address: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          address: string;
          lat: number;
          lng: number;
          source?: string;
          accuracy_meters?: number | null;
          raw_address?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["addresses"]["Insert"]>;
        Relationships: [];
      };
      recent_locations: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          address: string;
          lat: number;
          lng: number;
          last_used_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          address: string;
          lat: number;
          lng: number;
          last_used_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recent_locations"]["Insert"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          driver_id: string | null;
          pickup_address: string;
          destination_address: string;
          pickup_lat: number;
          pickup_lng: number;
          destination_lat: number;
          destination_lng: number;
          service_type: string;
          status: string;
          price: number;
          payment_method: string;
          cash_status: string;
          currency: string;
          accepted_at: string | null;
          driver_en_route_at: string | null;
          arrived_at: string | null;
          trip_started_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          driver_workflow_status: string | null;
          driver_notes: string | null;
          cash_collected_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          driver_id?: string | null;
          pickup_address: string;
          destination_address: string;
          pickup_lat: number;
          pickup_lng: number;
          destination_lat: number;
          destination_lng: number;
          service_type: string;
          status?: string;
          price: number;
          payment_method?: string;
          cash_status?: string;
          currency?: string;
          accepted_at?: string | null;
          driver_en_route_at?: string | null;
          arrived_at?: string | null;
          trip_started_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          driver_workflow_status?: string | null;
          driver_notes?: string | null;
          cash_collected_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      roadside_requests: {
        Row: {
          id: string;
          user_id: string;
          operator_id: string | null;
          issue_type: string;
          description: string | null;
          status: string;
          lat: number;
          lng: number;
          payment_method: string;
          cash_status: string;
          currency: string;
          estimated_price: number;
          speed_tier: string;
          normal_price: number | null;
          fast_price: number | null;
          final_price: number | null;
          fast_guarantee_deadline: string | null;
          fast_guarantee_applied: boolean;
          accepted_at: string | null;
          operator_en_route_at: string | null;
          operator_marked_arrived_at: string | null;
          customer_confirmed_arrived_at: string | null;
          operator_marked_solved_at: string | null;
          customer_confirmed_solved_at: string | null;
          completion_disputed_at: string | null;
          completion_dispute_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          operator_id?: string | null;
          issue_type: string;
          description?: string | null;
          status?: string;
          lat: number;
          lng: number;
          payment_method?: string;
          cash_status?: string;
          currency?: string;
          estimated_price?: number;
          speed_tier?: string;
          normal_price?: number | null;
          fast_price?: number | null;
          final_price?: number | null;
          fast_guarantee_deadline?: string | null;
          fast_guarantee_applied?: boolean;
          accepted_at?: string | null;
          operator_en_route_at?: string | null;
          operator_marked_arrived_at?: string | null;
          customer_confirmed_arrived_at?: string | null;
          operator_marked_solved_at?: string | null;
          customer_confirmed_solved_at?: string | null;
          completion_disputed_at?: string | null;
          completion_dispute_reason?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadside_requests"]["Insert"]>;
        Relationships: [];
      };
      fleet_organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fleet_organizations"]["Insert"]>;
        Relationships: [];
      };
      fleets: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          fleet_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          fleet_type: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fleets"]["Insert"]>;
        Relationships: [];
      };
      fleet_members: {
        Row: {
          id: string;
          fleet_id: string;
          user_id: string;
          role: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          fleet_id: string;
          user_id: string;
          role: string;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fleet_members"]["Insert"]>;
        Relationships: [];
      };
      fleet_vehicles: {
        Row: {
          id: string;
          fleet_id: string;
          owner_id: string | null;
          fleet_type: string;
          vehicle_kind: string;
          vehicle_type: string;
          brand: string | null;
          model: string | null;
          plate_number: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fleet_id: string;
          owner_id?: string | null;
          fleet_type?: string;
          vehicle_kind: string;
          vehicle_type?: string;
          brand?: string | null;
          model?: string | null;
          plate_number?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["fleet_vehicles"]["Insert"]>;
        Relationships: [];
      };
      driver_locations: {
        Row: {
          id: string;
          driver_id: string;
          lat: number;
          lng: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          lat: number;
          lng: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_locations"]["Insert"]>;
        Relationships: [];
      };
      driver_availability: {
        Row: {
          driver_id: string;
          online: boolean;
          workflow_status: string;
          lat: number | null;
          lng: number | null;
          shift_started_at: string | null;
          updated_at: string;
        };
        Insert: {
          driver_id: string;
          online?: boolean;
          workflow_status?: string;
          lat?: number | null;
          lng?: number | null;
          shift_started_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_availability"]["Insert"]>;
        Relationships: [];
      };
      driver_ride_offers: {
        Row: {
          id: string;
          booking_id: string;
          driver_id: string;
          status: string;
          expires_at: string;
          responded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          driver_id: string;
          status?: string;
          expires_at: string;
          responded_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_ride_offers"]["Insert"]>;
        Relationships: [];
      };
      driver_shift_sessions: {
        Row: {
          id: string;
          driver_id: string;
          started_at: string;
          ended_at: string | null;
          online_minutes: number;
          completed_rides: number;
          gross_earnings: number;
          cash_collected: number;
          card_earnings: number;
          currency: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          started_at?: string;
          ended_at?: string | null;
          online_minutes?: number;
          completed_rides?: number;
          gross_earnings?: number;
          cash_collected?: number;
          card_earnings?: number;
          currency?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_shift_sessions"]["Insert"]>;
        Relationships: [];
      };
      driver_earnings_ledger: {
        Row: {
          id: string;
          driver_id: string;
          booking_id: string | null;
          amount: number;
          payment_method: string;
          entry_type: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          booking_id?: string | null;
          amount: number;
          payment_method: string;
          entry_type?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_earnings_ledger"]["Insert"]>;
        Relationships: [];
      };
      driver_events: {
        Row: {
          id: string;
          driver_id: string;
          booking_id: string | null;
          event_type: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          booking_id?: string | null;
          event_type: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["driver_events"]["Insert"]>;
        Relationships: [];
      };
      roadside_operator_locations: {
        Row: {
          id: string;
          operator_id: string;
          lat: number;
          lng: number;
          heading: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          operator_id: string;
          lat: number;
          lng: number;
          heading?: number;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadside_operator_locations"]["Insert"]>;
        Relationships: [];
      };
      ratings: {
        Row: {
          id: string;
          booking_id: string | null;
          roadside_request_id: string | null;
          rater_id: string;
          ratee_id: string;
          rater_role: string;
          ratee_role: string;
          rating: number;
          tags: string[];
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          roadside_request_id?: string | null;
          rater_id: string;
          ratee_id: string;
          rater_role: string;
          ratee_role: string;
          rating: number;
          tags?: string[];
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ratings"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      vehicles: {
        Row: {
          id: string;
          driver_id: string | null;
          owner_id: string | null;
          owner_role: string | null;
          vehicle_type: string;
          brand: string | null;
          model: string | null;
          plate_number: string | null;
          status: string;
          color: string | null;
          production_year: number | null;
          seats: number | null;
          fuel_type: string | null;
          capacity_kg: number | null;
          photo_url: string | null;
          notes: string | null;
          equipment: string | null;
          service_types: string[];
          vehicle_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id?: string | null;
          owner_id?: string | null;
          owner_role?: string | null;
          vehicle_type: string;
          brand?: string | null;
          model?: string | null;
          plate_number?: string | null;
          status?: string;
          color?: string | null;
          production_year?: number | null;
          seats?: number | null;
          fuel_type?: string | null;
          capacity_kg?: number | null;
          photo_url?: string | null;
          notes?: string | null;
          equipment?: string | null;
          service_types?: string[];
          vehicle_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Insert"]>;
        Relationships: [];
      };
      user_documents: {
        Row: {
          id: string;
          user_id: string;
          vehicle_id: string | null;
          document_type: string;
          file_path: string;
          status: string;
          rejection_reason: string | null;
          expires_at: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vehicle_id?: string | null;
          document_type: string;
          file_path: string;
          status?: string;
          rejection_reason?: string | null;
          expires_at?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_documents"]["Insert"]>;
        Relationships: [];
      };
      login_audit_events: {
        Row: {
          id: string;
          user_id: string | null;
          requested_instance: string | null;
          resolved_role: string | null;
          success: boolean;
          failure_reason: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          requested_instance?: string | null;
          resolved_role?: string | null;
          success?: boolean;
          failure_reason?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["login_audit_events"]["Insert"]>;
        Relationships: [];
      };
      chat_threads: {
        Row: {
          id: string;
          booking_id: string | null;
          roadside_request_id: string | null;
          support_ticket_id: string | null;
          thread_type: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id?: string | null;
          roadside_request_id?: string | null;
          support_ticket_id?: string | null;
          thread_type: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_threads"]["Insert"]>;
        Relationships: [];
      };
      chat_participants: {
        Row: {
          id: string;
          thread_id: string;
          user_id: string;
          participant_role: string;
          last_read_at: string | null;
          muted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          user_id: string;
          participant_role: string;
          last_read_at?: string | null;
          muted?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_participants"]["Insert"]>;
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string | null;
          message_type: string;
          body: string | null;
          metadata: Json;
          attachment_url: string | null;
          created_at: string;
          edited_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id?: string | null;
          message_type?: string;
          body?: string | null;
          metadata?: Json;
          attachment_url?: string | null;
          created_at?: string;
          edited_at?: string | null;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
        Relationships: [];
      };
      support_tickets: {
        Row: {
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
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by: string;
          assigned_to?: string | null;
          related_booking_id?: string | null;
          related_roadside_request_id?: string | null;
          related_vehicle_id?: string | null;
          category: string;
          priority?: string;
          status?: string;
          subject: string;
          description: string;
          contact_preference?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_tickets"]["Insert"]>;
        Relationships: [];
      };
      support_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string | null;
          body: string;
          attachment_url: string | null;
          internal_note: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_id?: string | null;
          body: string;
          attachment_url?: string | null;
          internal_note?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_messages"]["Insert"]>;
        Relationships: [];
      };
      support_events: {
        Row: {
          id: string;
          ticket_id: string;
          actor_id: string | null;
          event_type: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          actor_id?: string | null;
          event_type: string;
          payload?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SupabaseJson = Json;
