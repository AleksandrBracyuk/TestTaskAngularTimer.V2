import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  Observable,
  fromEvent,
  interval,
  merge,
  concat,
  noop,
  NEVER,
  of,
} from 'rxjs';
import { map, mapTo, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { buffer, filter, throttleTime } from 'rxjs/operators';

enum Timer2ClickButton {
  startButton,
  stopButton,
  waitButton,
  resetButton,
}

@Component({
  selector: 'app-timer2',
  templateUrl: './timer2.component.html',
  styleUrls: ['./timer2.component.scss'],
})
export class Timer2Component implements OnInit, AfterViewInit {
  @ViewChild('startButton') startButton: ElementRef;
  @ViewChild('waitButton') waitButton: ElementRef;
  @ViewChild('resetButton') resetButton: ElementRef;

  data: Observable<Date>;

  constructor() {}

  ngOnInit(): void {
    this.data = NEVER.pipe(startWith(new Date(2020, 0, 1, 0, 0, 0)));
  }

  ngAfterViewInit() {
    let stream = (b, t) => fromEvent(b, 'click').pipe(mapTo(t));
    // let waitButtonStreamRaw$ = stream(
    //   this.waitButton.nativeElement,
    //   Timer2ClickButton.waitButton
    // );
    // let waitButtonStream$ = waitButtonStreamRaw$.pipe(
    //   buffer(waitButtonStreamRaw$.pipe(throttleTime(300))),
    //   filter((clickArray) => clickArray.length > 1)
    // );
    let events$ = merge(
      stream(this.startButton.nativeElement, Timer2ClickButton.startButton),
      stream(this.waitButton.nativeElement, Timer2ClickButton.waitButton),
      // waitButtonStream$,
      stream(this.resetButton.nativeElement, Timer2ClickButton.resetButton)
    );

    let super$ = events$.pipe(
      startWith(new Date(2020, 0, 1)),
      switchMap((e) => this.SwitchMap(e))
    );

    this.data = super$;

    super$.subscribe((x) => {
      console.log(x.toTimeString().substr(0, 8));
    });
    events$.subscribe((x) => {
      console.log('events:' + x);
    });
  }
  private SwitchMap(button: Timer2ClickButton): Observable<Date> {
    let interval$ = interval(1000).pipe(
      map((x) => new Date(2020, 0, 1, 0, 0, x))
    );
    let stop$ = NEVER.pipe(startWith(new Date(2020, 0, 1, 0, 0, 0)));

    if (button == Timer2ClickButton.startButton) {
      return interval$;
    }
    if (button == Timer2ClickButton.waitButton) {
      return interval$;
    }
    if (button == Timer2ClickButton.resetButton) {
      return interval$;
    }
    if (button == Timer2ClickButton.stopButton) {
      return stop$;
    }
    return stop$;
  }
}
