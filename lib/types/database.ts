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
          title: string;
          destination: string;
          start_date: string | null;
          end_date: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          destination: string;
          start_date?: string | null;
          end_date?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          destination?: string;
          start_date?: string | null;
          end_date?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          trip_id: string;
          type: string;
          details: Json;
          price: number;
          currency: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          trip_id: string;
          type: string;
          details: Json;
          price: number;
          currency: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          trip_id?: string;
          type?: string;
          details?: Json;
          price?: number;
          currency?: string;
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
      // Add other tables as needed based on the user request context or leave as minimal placeholder
      // User mentioned: itinerary_items, saved_destinations, price_alerts, transactions
      itinerary_items: {
        Row: {
          id: string;
          // ... types would be here
        };
        Insert: {};
        Update: {};
      };
      saved_destinations: {
        Row: {
          id: string;
        };
        Insert: {};
        Update: {};
      };
      price_alerts: {
        Row: {
          id: string;
        };
        Insert: {};
        Update: {};
      };
      transactions: {
        Row: {
          id: string;
        };
        Insert: {};
        Update: {};
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
