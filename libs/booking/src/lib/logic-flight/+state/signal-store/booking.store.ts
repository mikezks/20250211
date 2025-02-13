import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { FlightService } from '../../data-access/flight.service';
import { Flight } from '../../model/flight';
import { FlightFilter } from '../../model/flight-filter';
import { initialBookingState } from './booking.model';

export const BookingStore = signalStore(
  { providedIn: 'root' },
  // State
  withState(initialBookingState),
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
    rxLoadFlights: rxMethod<FlightFilter>(pipe(
      switchMap(filter => flightService.find(
        filter.from, filter.to, filter.urgent
      )),
      tapResponse(
        flights => store.setFlights(flights),
        err => console.error(err)
      )
    ))
  })),
  withHooks(store => ({
    onInit: () => store.rxLoadFlights(store.filter)
  }))
);
