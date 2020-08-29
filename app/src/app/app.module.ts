import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { WaitButtonComponent } from './wait-button/wait-button.component';
import { SecondComponent } from './second/second.component';
import { TimerStreamComponent } from './timer-stream/timer-stream.component';
import { TimerStateComponent } from './timer-state/timer-state.component';
import { Timer2Component } from './timer2/timer2.component';
import { Timer2SimpleComponent } from './timer2-simple/timer2-simple.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    WaitButtonComponent,
    SecondComponent,
    TimerStreamComponent,
    TimerStateComponent,
    Timer2Component,
    Timer2SimpleComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
