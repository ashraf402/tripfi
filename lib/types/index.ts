import { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Trip = Database["public"]["Tables"]["trips"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

// Insert types (for creating new records)
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type TripInsert = Database["public"]["Tables"]["trips"]["Insert"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

// Update types (for partial updates)
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type TripUpdate = Database["public"]["Tables"]["trips"]["Update"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];
