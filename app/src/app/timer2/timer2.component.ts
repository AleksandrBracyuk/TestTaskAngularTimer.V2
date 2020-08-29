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
  // stopButton,
  waitButton,
  resetButton,
}
class Timer2State {
  isStarted: boolean;
  isWaited: boolean;
  currentSecond: number;
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
  currentState: Timer2State;

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
      switchMap((e) => {
        this.currentState = this.NextState(this.currentState, e);
        return this.SwitchMap(this.currentState);
      })
    );

    this.data = super$;

    super$.subscribe((x) => {
      console.log(x.toTimeString().substr(0, 8));
    });
    events$.subscribe((x) => {
      console.log('events:' + x);
    });
  }
  private SwitchMap(currentState: Timer2State): Observable<Date> {
    let run$ = interval(1000).pipe(
      map((x) => new Date(2020, 0, 1, 0, 0, currentState.currentSecond))
    );
    let wait$ = NEVER.pipe(
      startWith(new Date(2020, 0, 1, 0, 0, currentState.currentSecond))
    );
    if (currentState.isWaited) {
      return wait$;
    } else {
      if (currentState.isStarted) {
        return run$;
      } else {
        return wait$;
      }
    }
  }

  private NextState(
    currentState: Timer2State,
    command: Timer2ClickButton
  ): Timer2State {
    var nextState = currentState;

    switch (command) {
      case Timer2ClickButton.startButton:
        /*сняли с паузы*/
        if (currentState.isWaited) {
          nextState.isWaited = false;
        }
        /*остановили*/
        if (currentState.isStarted) {
          nextState.isStarted = false;
          nextState.currentSecond = 0;
        }
        /*запустили*/
        if (!currentState.isStarted) {
          nextState.isStarted = true;
        }
        break;

      case Timer2ClickButton.waitButton:
        /*поставили на паузу*/
        if (currentState.isStarted) {
          nextState.isWaited = true;
        }
        break;
      case Timer2ClickButton.resetButton:
        /*сбросили счетчик*/
        if (currentState.currentSecond > 0) {
          nextState.currentSecond = 0;
        }
        break;
      default:
        break;
    }

    return nextState;
  }
}
