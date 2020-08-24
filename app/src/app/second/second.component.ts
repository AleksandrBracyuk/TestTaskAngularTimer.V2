import { Component, OnInit } from '@angular/core';
import { SecondData } from './second-data';
import { SecondService } from './second.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.scss'],
})
export class SecondComponent implements OnInit {
  data: Observable<SecondData>;

  constructor(private service: SecondService) {}

  ngOnInit(): void {
    this.data = this.service.GetSecondData().subscribe();
  }
}
