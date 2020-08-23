import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { WaitButtonComponent } from './wait-button/wait-button.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    WaitButtonComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
