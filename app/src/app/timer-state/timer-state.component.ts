import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SecondData } from '../second/second-data';
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
import { TimerClickButton } from '../timer-stream/timer-click-button.enum';

class StateClass {
  isStarted: boolean = false;
  isWaited: boolean = false;
}
interface StateInterface {
  isStarted: boolean;
  isWaited: boolean;
}

@Component({
  selector: 'app-timer-state',
  templateUrl: './timer-state.component.html',
  styleUrls: ['./timer-state.component.scss'],
})
export class TimerStateComponent implements OnInit, AfterViewInit {
  @ViewChild('startButton') startButton: ElementRef;
  @ViewChild('waitButton') waitButton: ElementRef;
  @ViewChild('resetButton') resetButton: ElementRef;

  data: SecondData;
  secondsAfterStart: number;
  clickTo: TimerClickButton;

  // по аналогии с https://www.learnrxjs.io/learn-rxjs/recipes/stop-watch
  // по аналогии с https://medium.com/ngx/practical-use-rxjs-81aaab57045c
  constructor() {}

  ngOnInit(): void {
    this.data = new SecondData(0, false);
    this.secondsAfterStart = 0;
  }

  ngAfterViewInit() {
    let startButtonStream$ = fromEvent(
      this.startButton.nativeElement,
      'click'
    ).pipe(
      // scan((x) => !x, false),
      // map((x) =>
      //   x ? TimerClickButton.startButton : TimerClickButton.stopButton
      // )
      mapTo(TimerClickButton.startButton)
    );
    let waitButtonStreamRaw$ = fromEvent(
      this.waitButton.nativeElement,
      'click'
    );
    let waitButtonStream$ = waitButtonStreamRaw$.pipe(
      buffer(waitButtonStreamRaw$.pipe(throttleTime(300))),
      filter((clickArray) => clickArray.length > 1),
      mapTo(TimerClickButton.waitButton)
    );

    let resetButtonStream$ = fromEvent(
      this.resetButton.nativeElement,
      'click'
    ).pipe(mapTo(TimerClickButton.resetButton));

    let events$ = merge(
      startButtonStream$,
      waitButtonStream$,
      resetButtonStream$
    );
    //todo в потоке events нужно анализировать состояние и вводить stopButton:
    //если нажатие startButton произошло после startButton,
    //если нажатие startButton произошло после startButton и множественных нажатий resetButton,
    //если нажатие startButton произошло после startButton и множественных нажатий waitButton - остается startButton ,
    //если нажатие startButton произошло после startButton и множественных нажатий waitButton (и resetButton) - остается startButton ,
    //если нажатие startButton произошло после stopButton  - остается startButton ,
    //если нажатие startButton произошло после stopButton и множественных нажатий waitButton или resetButton  - остается startButton ,

    let super$ = events$.pipe(switchMap((e) => this.SwitchMap(e, this.data)));

    super$.subscribe((x: SecondData) => {
      this.data = x;
      console.log(this.data);
    });
    events$.subscribe((x) => {
      this.clickTo = x;
      console.log('events:' + x);
    });
  }

  // todo: повторное нажатие на start после wait - останавливает, а должно стартовать
  // todo: нажатие на reset после wait - запускает, а должно обнулять

  private SwitchMap(
    timerClickButton: TimerClickButton,
    data: SecondData
  ): Observable<SecondData> {
    if (timerClickButton == TimerClickButton.startButton) {
      return interval(1000).pipe(
        scan((x) => x + 1, this.data.secondsAfterStart),
        map((x) => (this.data = new SecondData(x, true)))
      );
    }
    if (timerClickButton == TimerClickButton.stopButton) {
      // return concat(of(new SecondData(0, false)), NEVER);
      return NEVER.pipe(startWith(new SecondData(0, false)));
    }
    if (timerClickButton == TimerClickButton.waitButton) {
      // return concat(of(this.data), NEVER);
      return NEVER.pipe(startWith(this.data));
    }
    if (timerClickButton == TimerClickButton.resetButton) {
      this.data.secondsAfterStart = 0;
      if (this.data.isStarted)
        return interval(1000).pipe(
          scan((x) => x + 1, this.data.secondsAfterStart),
          map((x) => (this.data = new SecondData(x, true)))
        );
      else {
        // return concat(of(new SecondData(0, false)), NEVER);
        return NEVER.pipe(startWith(new SecondData(0, false)));
      }
    }
  }
}
