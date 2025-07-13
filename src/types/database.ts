// src/types/database.ts
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
}

export interface Airport {
  id: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: string;
  code: string;
  name: string;
}

export interface Seat {
  flight_id: string;
  seat_class: string;
  available: number;
}

export interface Flight {
  id: string;
  flight_no: string;
  departure: string;
  arrival: string;
  duration_min: number;
  base_price: number;
  airlines: Airline;
  origin: Airport;
  destination: Airport;
  seats: Seat[];
  status: string;
  available: number;
}

export interface Database {
  public: {
    airports: Airport;
    airlines: Airline;
    flights: Flight;
    seats: Seat;
    // ... other tables
  };
}

export interface Filters {
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  minPrice: number | '';
  maxPrice: number | '';
}

export interface Booking {
  id: string;
  flight_id: string;
  status: string;
  booked_at: string;
  cancelled_at?: string;
  passenger_count: number;
  total_price: number;
  flights: {
    flight_no: string;
    departure: string;
    arrival: string;
  };
  ticketUrl: string | null;
}

