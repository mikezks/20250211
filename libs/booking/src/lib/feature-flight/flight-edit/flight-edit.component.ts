import { Component, DestroyRef, effect, inject, Injector, input, numberAttribute, runInInjectionContext } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { routerFeature } from '@flight-demo/shared-state';
import { Store } from '@ngrx/store';
import { initialFlight } from '../../logic-flight';
import { FlightService } from '../../api-boarding';
import { interval, switchMap } from 'rxjs';


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
  /* private destroyRef = inject(DestroyRef);
  private injector = inject(Injector); */

  readonly id = input(0, { transform: numberAttribute });
  readonly flight = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.flightService.findById(id))
    ), { initialValue: initialFlight }
  );

  /* readonly counterSubscription = interval(1_000).pipe(
    takeUntilDestroyed()
  ).subscribe(console.log); */

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

    // this.destroyRef.onDestroy(() => console.log('Bye, bye!'))
  }

  protected save(): void {
    console.log(this.editForm.value);

    /* runInInjectionContext(this.injector, () => {
      interval(1_000).pipe(
        takeUntilDestroyed()
      ).subscribe(console.log);
    }); */
  }
}
