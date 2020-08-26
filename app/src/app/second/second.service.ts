import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SecondData } from './second-data';
import { interval } from 'rxjs';
import { scan, map, publish, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SecondService {
  secondsAfterStart: number = 0;
  private observable: Observable<SecondData>;

  constructor() {
    this.observable = this.start();
  }

  private start(): Observable<SecondData> {
    let stream$ = interval(1000).pipe(
      scan((x) => x + 1, this.secondsAfterStart),
      map((x) => new SecondData(x, true)),
      publish(),
      refCount()
    );

    /*
    http://reactivex.io/documentation/operators/connect.html
    In RxJS, the connect operator is a method of the ConnectableObservable
     prototype. You can use the publish operator to convert an ordinary
      Observable into a ConnectableObservable.
    */
    // this.timer.connect();

    return stream$;
  }

  public subscribe(observer: (value: SecondData) => void) {
    return this.observable.subscribe(observer);
  }
}
