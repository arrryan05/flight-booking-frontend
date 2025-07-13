import type { Flight, Filters } from '@/types/database';

self.onmessage = (e: MessageEvent<{ flights: Flight[]; filters: Filters }>) => {
  const { flights, filters } = e.data;
  const { cabinClass, minPrice, maxPrice } = filters;

  const filtered = flights.filter((f) => {
    // cabin availability
    const seat = f.seats.find((s) => s.seat_class === cabinClass);
    if (!seat || seat.available < 1) return false;

    // price range
    if (typeof minPrice === 'number' && f.base_price < minPrice) return false;
    if (typeof maxPrice === 'number' && f.base_price > maxPrice) return false;

    return true;
  });

  // post back filtered flights
  (self as any).postMessage(filtered);
};
