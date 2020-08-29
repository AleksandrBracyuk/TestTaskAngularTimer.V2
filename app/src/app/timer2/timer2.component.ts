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
import {
  map,
  mapTo,
  scan,
  startWith,
  switchMap,
  mergeMap,
  tap,
  publish,
  refCount,
} from 'rxjs/operators';
import { buffer, filter, throttleTime } from 'rxjs/operators';

enum Timer2ClickButton {
  startButton,
  waitButton,
  resetButton,
  stopButton,
}
class Timer2State {
  isStarted: boolean = false;
  isWaited: boolean = false;
  currentSecond: number = 0;
}
interface Time2AccumulateState {
  isStarted: boolean;
  isWaited: boolean;
  currentSecond: number;
}
interface Time2StateCommand {
  isStarted: boolean;
  isWaited: boolean;
  command: Timer2ClickButton;
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
  currentState: Timer2State = new Timer2State();

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
    let eventsRam$ = merge(
      stream(this.startButton.nativeElement, Timer2ClickButton.startButton),
      stream(this.waitButton.nativeElement, Timer2ClickButton.waitButton),
      // waitButtonStream$,
      stream(this.resetButton.nativeElement, Timer2ClickButton.resetButton)
    );

    let events$ = eventsRam$.pipe(
      map((x) => ({
        isStarted: false,
        isWaited: false,
        command: x,
        currentSecond: 0,
      })),
      scan(
        (s: Time2StateCommand, curr) => ({
          ...s,
          ...{
            isStarted:
              curr.command == Timer2ClickButton.startButton && !s.isStarted
                ? true
                : curr.command == Timer2ClickButton.startButton &&
                  s.isStarted &&
                  !s.isWaited
                ? false
                : s.isStarted,
          },
          ...{
            isWaited:
              curr.command == Timer2ClickButton.waitButton
                ? true
                : curr.command == Timer2ClickButton.startButton
                ? false
                : s.isWaited,
          },
          ...{
            command:
              s.command == Timer2ClickButton.stopButton
                ? curr.command
                : curr.command == Timer2ClickButton.startButton &&
                  s.isStarted &&
                  !s.isWaited
                ? Timer2ClickButton.stopButton
                : curr.command,
          },
        }),
        {
          isStarted: false,
          isWaited: false,
          command: Timer2ClickButton.stopButton,
          currentSecond: 0,
        }
      ),
      publish(),
      refCount()
    );

    let super$ = events$.pipe(
      switchMap((e) => {
        if (e.isWaited) {
          return NEVER.pipe(
            startWith({ ...e, ...{ currentSecond: e.currentSecond } })
          );
        } else {
          if (e.isStarted) {
            return interval(1000).pipe(
              map((x) => ({ ...e, ...{ currentSecond: e.currentSecond + x } }))
            );
          } else {
            return NEVER.pipe(
              startWith({ ...e, ...{ currentSecond: e.currentSecond } })
            );
          }
        }
      })
    );

    // let state$ = events$.pipe(
    //   map(x=>this.NextState(x,e))
    // );

    // let super$ = events$.pipe(
    //   startWith(new Date(2020, 0, 1)),
    //   switchMap((e) => this.SwitchMap(e))
    // );

    // this.data = super$;

    // super$.subscribe((x) => {
    //   console.log(x.toTimeString().substr(0, 8));
    // });
    events$.subscribe((x) => {
      console.log('events', x);
    });
    super$.subscribe((x) => {
      console.log('super', x);
    });
  }

  private SwitchMap(command: Timer2ClickButton): Observable<Date> {
    this.currentState = this.NextState(this.currentState, command);
    let run$ = interval(1000).pipe(map((x) => new Date(2020, 0, 1, 0, 0, x)));
    let wait$ = NEVER.pipe(
      startWith(new Date(2020, 0, 1, 0, 0, this.currentState.currentSecond))
    );
    console.log(this.currentState);
    if (this.currentState.isWaited) {
      return wait$;
    } else {
      if (this.currentState.isStarted) {
        return run$;
      } else {
        return wait$;
      }
    }
    return wait$;
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
        } else {
          /*остановили*/
          if (currentState.isStarted) {
            nextState.isStarted = false;
            nextState.currentSecond = 0;
          } else {
            /*запустили*/
            nextState.isStarted = true;
          }
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

  public testSpreadInObject() {
    let obj1 = {
      isStarted: false,
      isWaited: true,
      currentSecond: 111,
    };
    let obj2 = {
      isWaited: false,
      currentSecond: 5,
    };
    let obj3 = { ...obj1, ...obj2 };
    console.log(obj3);
  }
}
