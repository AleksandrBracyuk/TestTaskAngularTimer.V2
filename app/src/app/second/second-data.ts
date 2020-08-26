export class SecondData {
  hour: string = '00';
  minute: string = '00';
  second: string = '00';
  secondsAfterStart: number;

  isStarted: boolean = false;

  constructor(secondsAfterStart: number, isStarted: boolean) {
    this.secondsAfterStart = secondsAfterStart;
    this.isStarted = isStarted;

    let hour = Math.floor(secondsAfterStart / (60 * 60));
    let minute = Math.floor((secondsAfterStart - hour * 60 * 60) / 60);
    let second = secondsAfterStart - hour * 60 * 60 - minute * 60;

    let toZeroFirst = (x: number) => ('0' + x).slice(-2);

    this.hour = toZeroFirst(hour);
    this.minute = toZeroFirst(minute);
    this.second = toZeroFirst(second);
  }
}
