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
          registration_status: string;
          theme: string;
          preferred_payment_method: string;
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
          registration_status?: string;
          theme?: string;
          preferred_payment_method?: string;
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
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          address: string;
          lat: number;
          lng: number;
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
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadside_requests"]["Insert"]>;
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
          capacity_kg: number | null;
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
          capacity_kg?: number | null;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SupabaseJson = Json;
