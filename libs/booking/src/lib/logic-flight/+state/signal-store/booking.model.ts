import { Flight } from "../../model/flight";
import { FlightFilter } from "../../model/flight-filter"

export interface BookingState {
  filter: FlightFilter,
  basket: Record<number, boolean>,
  flights: Flight[]
}

export const initialBookingState: BookingState = {
  filter: {
    from: 'Hamburg',
    to: 'Graz',
    urgent: false
  },
  basket: {
    3: true,
    5: true,
  },
  flights: []
};
