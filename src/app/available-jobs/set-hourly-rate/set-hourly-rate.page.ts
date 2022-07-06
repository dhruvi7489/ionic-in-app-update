import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { JobUtilervice } from 'src/app/core/util/job-util.service';
import { AvailableJobsService } from '../available-jobs.service';
import { JobApplicationModalPage } from '../job-application-modal/job-application-modal.page';

@Component({
  selector: 'app-set-hourly-rate',
  templateUrl: './set-hourly-rate.page.html',
  styleUrls: ['./set-hourly-rate.page.scss'],
})
export class SetHourlyRatePage implements OnInit {
  hourlyRate: any = 0;
  minTotal = 0;
  maxTotal = 0;
  btnTitle = 'Apply';
  updatedRate: any = 0;
  estimatedIncome: any = 0;

  constructor(
    public modalCtrl: ModalController,
    public availableJobsService: AvailableJobsService,
    public jobUtilService: JobUtilervice,
    public location: Location,
    public router: Router
  ) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    await this.getTotal();
    if (this.availableJobsService.selectedJobDetails) {
      if (this.availableJobsService.selectedJobPreferences) {
        await this.calculateRatePerHour();
      } else {
        await this.availableJobsService.applyForSelectedJob(false);
        await this.calculateRatePerHour();
      }
    } else {
      this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
    }
  }

  getTotal() {
    this.minTotal = 0;
    this.maxTotal = 0;
    this.availableJobsService.selectedJobDetails?.dates.forEach(date => {
      const hours = this.jobUtilService.hoursOfJob(date.timeFrom, date.timeTo);
      this.minTotal = this.minTotal + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.minRate * hours));
      this.maxTotal = this.maxTotal + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.maxRate * hours));
    });
  }

  async calculateRatePerHour() {
    this.availableJobsService.jobPref = this.availableJobsService.selectedJobPreferences.content[0];
    await this.availableJobsService.jobPref.jobTypePreferences.forEach(async prefType => {
      if (this.availableJobsService.selectedJobDetails?.jobTypeId == prefType.typeId) {
        this.estimatedIncome = 0;
        this.hourlyRate = prefType.maxHourlyRate;
        if (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.maxRate <= prefType.maxHourlyRate) {
          this.updatedRate = 0;
        } else {
          this.updatedRate = prefType.maxHourlyRate;
          for (let date of this.availableJobsService.selectedJobDetails?.dates) {
            let hours = this.jobUtilService.hoursOfJob(date.timeFrom, date.timeTo);
            this.estimatedIncome = this.estimatedIncome + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.updatedRate * hours));
          }
        }
      }
    });
  }

  cancelJob() {
    this.location.back();
  }

  async submitJob() {
    if (this.availableJobsService.jobPref) {
      await this.availableJobsService.jobPref.jobTypePreferences.forEach(async prefType => {
        if (this.availableJobsService.selectedJobDetails?.jobTypeId == prefType.typeId) {
          prefType.maxHourlyRate = this.hourlyRate,
            prefType.level = this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo?.level
        }
      })
    }
    await this.availableJobsService.updateHourlyRateRange(this.hourlyRate, false);
  }

  rateSliderChanged(event) {
    this.hourlyRate = event.target.value;
    this.estimatedIncome = 0;
    for (let date of this.availableJobsService.selectedJobDetails?.dates) {
      let hours = this.jobUtilService.hoursOfJob(date.timeFrom, date.timeTo);
      this.estimatedIncome = this.estimatedIncome + (this.hourlyRate * hours) + this.availableJobsService.selectedJobDetails?.basePrice;
      this.estimatedIncome = Math.round(Math.abs(this.estimatedIncome));
    }
  }
}
