import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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
    public setHourlyRatesService: SetHourlyRatesService,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.setHourlyRatesService.getJobPreference();
    this.setHourlyRatesService.getJobPreferences();
  }

  back() {
    if (this.navParams.get('modal')) {
      this.modalCtrl.dismiss();
    } else {
      this.location.back();
    }
  }

  async rateSliderChanged(event, jobType) {
    jobType.finalAmount = await
      this.setHourlyRatesService.calculateFinalAmount(jobType.basePrice, jobType.maxHourlyRate, jobType.shiftHours);
  }

  saveHourlyRates() {
    this.setHourlyRatesService.setHourlyRates();
  }

  changeHourlyRate(jobType) {
    jobType.finalAmount = this.setHourlyRatesService.calculateFinalAmount(jobType.basePrice, jobType.maxHourlyRate, jobType.shiftHours);
  }
}
