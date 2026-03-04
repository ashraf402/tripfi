export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          name: string | null;
          avatar_url: string | null;
          website: string | null;
          travel_style: string[] | null;
          bch_wallet_address: string | null;
          onboarding_completed: boolean;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          travel_style?: string[] | null;
          bch_wallet_address?: string | null;
          onboarding_completed?: boolean;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          travel_style?: string[] | null;
          bch_wallet_address?: string | null;
          onboarding_completed?: boolean;
        };
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          booking_id: string;
          title: string | null;
          destination: string | null;
          destination_city: string | null;
          cover_image_url: string | null;
          departure_date: string | null;
          return_date: string | null;
          status: string | null;
          travel_style: string | null;
          travelers: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          booking_id: string;
          title?: string | null;
          destination?: string | null;
          destination_city?: string | null;
          cover_image_url?: string | null;
          departure_date?: string | null;
          return_date?: string | null;
          status?: string | null;
          travel_style?: string | null;
          travelers?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          booking_id?: string;
          title?: string | null;
          destination?: string | null;
          destination_city?: string | null;
          cover_image_url?: string | null;
          departure_date?: string | null;
          return_date?: string | null;
          status?: string | null;
          travel_style?: string | null;
          travelers?: number | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          user_id: string;
          conversation_id: string | null;
          origin: string | null;
          destination: string | null;
          destination_city: string | null;
          departure_date: string | null;
          return_date: string | null;
          travelers: number | null;
          trip_days: number | null;
          travel_style: string | null;
          total_usd: number | null;
          total_bch: number | null;
          bch_rate_at_booking: number | null;
          flight_data: Json | null;
          hotel_data: Json | null;
          itinerary_data: Json | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          user_id: string;
          conversation_id?: string | null;
          origin?: string | null;
          destination?: string | null;
          destination_city?: string | null;
          departure_date?: string | null;
          return_date?: string | null;
          travelers?: number | null;
          trip_days?: number | null;
          travel_style?: string | null;
          total_usd?: number | null;
          total_bch?: number | null;
          bch_rate_at_booking?: number | null;
          flight_data?: Json | null;
          hotel_data?: Json | null;
          itinerary_data?: Json | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          user_id?: string;
          conversation_id?: string | null;
          origin?: string | null;
          destination?: string | null;
          destination_city?: string | null;
          departure_date?: string | null;
          return_date?: string | null;
          travelers?: number | null;
          trip_days?: number | null;
          travel_style?: string | null;
          total_usd?: number | null;
          total_bch?: number | null;
          bch_rate_at_booking?: number | null;
          flight_data?: Json | null;
          hotel_data?: Json | null;
          itinerary_data?: Json | null;
          status?: string | null;
        };
        Relationships: [];
      };
      payment_transactions: {
        Row: {
          id: string;
          created_at: string;
          booking_id: string;
          user_id: string;
          payment_id: string | null;
          payment_url: string | null;
          amount_bch: number | null;
          amount_usd: number | null;
          status: string | null;
          is_testnet: boolean | null;
          confirmed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          booking_id: string;
          user_id: string;
          payment_id?: string | null;
          payment_url?: string | null;
          amount_bch?: number | null;
          amount_usd?: number | null;
          status?: string | null;
          is_testnet?: boolean | null;
          confirmed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          booking_id?: string;
          user_id?: string;
          payment_id?: string | null;
          payment_url?: string | null;
          amount_bch?: number | null;
          amount_usd?: number | null;
          status?: string | null;
          is_testnet?: boolean | null;
          confirmed_at?: string | null;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          title: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          title: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          conversation_id: string;
          role: string;
          content: string;
          component: string | null;
          data: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          conversation_id: string;
          role: string;
          content: string;
          component?: string | null;
          data?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          component?: string | null;
          data?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
