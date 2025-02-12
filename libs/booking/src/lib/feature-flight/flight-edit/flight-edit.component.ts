import { Component, effect, inject, input, numberAttribute } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { routerFeature } from '@flight-demo/shared-state';
import { Store } from '@ngrx/store';
import { initialFlight } from '../../logic-flight';
import { FlightService } from '../../api-boarding';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-flight-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './flight-edit.component.html'
})
export class FlightEditComponent {
  private store = inject(Store);
  private flightService = inject(FlightService);

  readonly id = input(0, { transform: numberAttribute });
  readonly id$ = toObservable(this.id);
  readonly flight$ = this.id$.pipe(
    switchMap(id => this.flightService.findById(id))
  );
  readonly flight = toSignal(this.flight$, {
    initialValue: initialFlight
  });

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });

  constructor() {
    this.store.select(routerFeature.selectRouteParams).subscribe(
      params => console.log(params)
    );

    effect(() => this.editForm.patchValue(
      this.flight()
    ));
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
