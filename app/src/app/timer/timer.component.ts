import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  hour: string = '00';
  minute: string = '00';
  second: string = '00';

  secondsAfterStart: number = 0;

  interval: number;
  isStarted: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  showTime() {
    let hour = Math.floor(this.secondsAfterStart / (60 * 60));
    let minute = Math.floor((this.secondsAfterStart - hour * 60 * 60) / 60);
    let second = this.secondsAfterStart - hour * 60 * 60 - minute * 60;

    let toZeroFirst = (x: number) => ('0' + x).slice(-2);

    this.hour = toZeroFirst(hour);
    this.minute = toZeroFirst(minute);
    this.second = toZeroFirst(second);
  }

  switchStart() {
    if (this.isStarted) {
      this.stop();
    } else {
      this.start();
    }
  }
  start() {
    this.interval = setInterval(() => {
      this.secondsAfterStart++;
      this.showTime();
    }, 1000);
    this.isStarted = true;
  }
  reset() {
    this.secondsAfterStart = 0;
    this.showTime();
  }
  pause() {
    clearInterval(this.interval);
    this.isStarted = false;
    // без этой перерисовки возникает ощущение что Wait как-то тормозит:
    this.showTime();
  }
  stop() {
    clearInterval(this.interval);
    this.isStarted = false;
    this.secondsAfterStart = 0;
    this.showTime();
  }
}
