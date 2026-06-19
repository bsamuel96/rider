import type { Json } from "./json";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          theme: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          theme?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
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
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type SupabaseJson = Json;
