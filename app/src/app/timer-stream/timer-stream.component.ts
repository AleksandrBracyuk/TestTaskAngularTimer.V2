import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { SecondData } from '../second/second-data';
import { fromEvent, interval, merge, noop, NEVER } from 'rxjs';
import { map, mapTo, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { buffer, filter, throttleTime } from 'rxjs/operators';
import { TimerClickButton } from './timer-click-button.enum';

@Component({
  selector: 'app-timer-stream',
  templateUrl: './timer-stream.component.html',
  styleUrls: ['./timer-stream.component.scss'],
})
export class TimerStreamComponent implements OnInit, AfterViewInit {
  @ViewChild('startButton') startButton: ElementRef;
  @ViewChild('waitButton') waitButton: ElementRef;
  @ViewChild('resetButton') resetButton: ElementRef;

  data: SecondData;
  clickTo: TimerClickButton;

  // по аналогии с https://www.learnrxjs.io/learn-rxjs/recipes/stop-watch
  constructor() {}

  ngOnInit(): void {
    this.data = new SecondData(0, false);
  }

  ngAfterViewInit() {
    let startButtonStream$ = fromEvent(this.startButton.nativeElement, 'click');
    let waitButtonStreamRaw$ = fromEvent(
      this.waitButton.nativeElement,
      'click'
    );
    let waitButtonStream$ = waitButtonStreamRaw$.pipe(
      buffer(waitButtonStreamRaw$.pipe(throttleTime(300))),
      filter((clickArray) => clickArray.length > 1)
    );
    let resetButtonStream$ = fromEvent(this.resetButton.nativeElement, 'click');

    let clickStream$ = merge(
      startButtonStream$.pipe(mapTo(TimerClickButton.startButton)),
      waitButtonStreamRaw$.pipe(mapTo(TimerClickButton.waitButton)),
      resetButtonStream$.pipe(mapTo(TimerClickButton.resetButton))
    );

    clickStream$.subscribe((x) => {
      this.clickTo = x;
      console.log('click');
    });
  }
}
