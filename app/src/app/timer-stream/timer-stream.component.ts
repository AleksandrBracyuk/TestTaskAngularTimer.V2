import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer-stream',
  templateUrl: './timer-stream.component.html',
  styleUrls: ['./timer-stream.component.scss'],
})
export class TimerStreamComponent implements OnInit {
  // по аналогии с https://www.learnrxjs.io/learn-rxjs/recipes/stop-watch
  constructor() {}

  ngOnInit(): void {}
}
