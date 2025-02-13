import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Flight } from '../../model/flight';
import { computed, inject } from '@angular/core';
import { FlightFilter } from '../../model/flight-filter';
import { FlightService } from '../../data-access/flight.service';

export const BookingStore = signalStore(
  { providedIn: 'root' },
  // State
  withState({
    filter: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false
    },
    basket: {
      3: true,
      5: true,
    } as Record<number, boolean>,
    flights: [] as Flight[]
  }),
  // Derived State
  withComputed(store => ({
    delayedFlights: computed(
      () => store.flights().filter(flight => flight.delayed)
    )
  })),
  // Updater
  withMethods(store => ({
    setFilter: (filter: FlightFilter) => patchState(store, { filter }),
    setFlights: (flights: Flight[]) => patchState(store, { flights }),
    resetFlights: () => patchState(store, { flights: [] }),
    updateBasket: (id: number, selected: boolean) => patchState(store, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    })),
  })),
  // Side-Effects
  withMethods((
    store,
    flightService = inject(FlightService)
  ) => ({
    loadFlights: () => {
      flightService.find(
        store.filter.from(),
        store.filter.to(),
        store.filter.urgent()
      ).subscribe(
        flights => store.setFlights(flights)
      )
    }
  })),
);
