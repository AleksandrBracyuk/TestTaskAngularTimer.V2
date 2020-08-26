import { Component, OnInit } from '@angular/core';
import { SecondData } from './second-data';
import { SecondService } from './second.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
})
export class SecondComponent implements OnInit {
  data: SecondData;

  constructor(private secondService: SecondService) {}

  ngOnInit(): void {
    this.secondService.subscribe((x) => (this.data = x));
  }
}
