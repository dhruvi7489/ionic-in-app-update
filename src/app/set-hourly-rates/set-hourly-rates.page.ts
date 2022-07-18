import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SetHourlyRatesService } from './set-hourly-rates.service';

@Component({
  selector: 'app-set-hourly-rates',
  templateUrl: './set-hourly-rates.page.html',
  styleUrls: ['./set-hourly-rates.page.scss'],
})
export class SetHourlyRatesPage implements OnInit {
  hourlyRate: number = 0;
  hours: any = null;

  constructor(
    public location: Location,
    public setHourlyRatesService: SetHourlyRatesService
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

  rateSliderChanged(event) {

  }

  saveHourlyRates() {
    this.setHourlyRatesService.setHourlyRates();
  }
}
