import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { WaitButtonComponent } from './wait-button/wait-button.component';
import { SecondComponent } from './second/second.component';
import { TimerStreamComponent } from './timer-stream/timer-stream.component';
import { TimerStateComponent } from './timer-state/timer-state.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    WaitButtonComponent,
    SecondComponent,
    TimerStreamComponent,
    TimerStateComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
