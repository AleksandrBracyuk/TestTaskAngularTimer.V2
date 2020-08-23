import {
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { buffer, filter, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-wait-button',
  templateUrl: './wait-button.component.html',
  styleUrls: ['./wait-button.component.scss'],
  inputs: ['isActive'],
})
export class WaitButtonComponent implements OnInit, AfterViewInit {
  isActive: boolean;
  @Output()
  clickTwice: EventEmitter<any> = new EventEmitter();

  constructor(public element: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let clicks$ = fromEvent(this.element.nativeElement, 'click');
    clicks$
      .pipe(
        buffer(clicks$.pipe(throttleTime(300))),
        filter((clickArray) => clickArray.length > 1)
      )
      .subscribe(() => {
        this.clickTwice.emit(null);
      });
  }
}
