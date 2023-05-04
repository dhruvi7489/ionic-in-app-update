import { Location } from '@angular/common';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { JobUtilervice } from 'src/app/core/util/job-util.service';
import { ToastService } from 'src/app/core/services/toast.service';
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
  diableSubmitBtn: boolean = false;
  initialEstimatedIncome: any = 0;

  constructor(
    public modalCtrl: ModalController,
    public availableJobsService: AvailableJobsService,
    public jobUtilService: JobUtilervice,
    public location: Location,
    public router: Router,
    public toastService: ToastService,
    public cdr: ApplicationRef
  ) { }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    // this.availableJobsService.getSelectedJobById();
    if (this.availableJobsService.selectedJobDetails) {
      if (this.availableJobsService.selectedJobPreferences) {
        await this.calculateRatePerHour();
      } else {
        await this.availableJobsService.JobPreference(false);
        await this.calculateRatePerHour();
      }
    } else {
      this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
    }
  }

  getMinTotal() {
    this.minTotal = 0;
    this.availableJobsService.selectedJobDetails?.dates.forEach(date => {
      const hours = this.jobUtilService.hoursOfJob(date.date, date.timeFrom, date.timeTo);
      this.minTotal += Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.minRate * hours));
    });
    return this.minTotal;
  }

  getMaxTotal() {
    this.maxTotal = 0;
    this.availableJobsService.selectedJobDetails?.dates.forEach(date => {
      const hours = this.jobUtilService.hoursOfJob(date.date, date.timeFrom, date.timeTo);
      this.maxTotal += Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.maxRate * hours));
    });
    return this.maxTotal;
  }

  async calculateRatePerHour() {
    this.availableJobsService.jobPref = this.availableJobsService.selectedJobPreferences.content[0];
    await this.availableJobsService?.jobPref?.jobTypePreferences?.forEach(async prefType => {
      if (this.availableJobsService.selectedJobDetails?.jobTypeId == prefType.typeId) {
        // if (prefType.status != "Pending") {
        this.diableSubmitBtn = false;
        this.estimatedIncome = 0;
        this.initialEstimatedIncome = 0;
        this.hourlyRate = prefType.maxHourlyRate;
        if (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.maxRate <= prefType.maxHourlyRate) {
          this.updatedRate = 0;
        } else {
          this.updatedRate = prefType.maxHourlyRate;
          for (let date of this.availableJobsService.selectedJobDetails?.dates) {
            let hours = this.jobUtilService.hoursOfJob(date.date, date.timeFrom, date.timeTo);
            this.estimatedIncome = this.estimatedIncome + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.updatedRate * hours));
            this.initialEstimatedIncome = this.initialEstimatedIncome + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.updatedRate * hours));
          }
        }
        // } else {
        //   this.toastService.showMessage("You can't apply to this job now, please wait for job type approval");
        //   this.diableSubmitBtn = true;
        // }
      }
    });
  }

  cancelJob() {
    this.location.back();
  }

  submitJob() {
    if (this.availableJobsService.jobPref) {
      this.availableJobsService.jobPref.jobTypePreferences.forEach(async prefType => {
        prefType.maxHourlyRate = prefType.maxHourlyRate ? prefType.maxHourlyRate : 1;
        prefType.level = prefType.level ? prefType.level : "Intermediate";

        if (this.availableJobsService.selectedJobDetails?.jobTypeId == prefType.typeId) {
          prefType.maxHourlyRate = this.hourlyRate ? this.hourlyRate : 1;
          prefType.level = this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo?.level ? this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo?.level : "";
        }
      })
    }
    this.availableJobsService.updateHourlyRateRange(this.hourlyRate, false);
  }

  rateSliderChanged(event) {
    this.hourlyRate = 0;
    this.estimatedIncome = 0;
    if (!isNaN(event.target.value)) {
      this.hourlyRate += event.target.value;
    }
    for (let date of this.availableJobsService.selectedJobDetails?.dates) {
      let hours = this.jobUtilService.hoursOfJob(date.date, date.timeFrom, date.timeTo);
      this.estimatedIncome = this.estimatedIncome + (this.hourlyRate * hours) + this.availableJobsService.selectedJobDetails?.basePrice;
      this.estimatedIncome = Math.round(Math.abs(this.estimatedIncome));
    }
    this.cdr.tick();
  }

  disable() {
    return this.estimatedIncome <= 0 || this.estimatedIncome == this.initialEstimatedIncome || this.hourlyRate <= 0;
  }
}
