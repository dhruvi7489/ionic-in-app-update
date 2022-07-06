import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobUtilervice } from 'src/app/core/util/job-util.service';
import { AvailableJobsService } from '../available-jobs.service';

@Component({
  selector: 'app-available-job-details',
  templateUrl: './available-job-details.page.html',
  styleUrls: ['./available-job-details.page.scss'],
})
export class AvailableJobDetailsPage implements OnInit {
  show = false;
  minTotal = 0;
  maxTotal = 0;
  btnTitle = '';

  constructor(
    public router: Router,
    public availableJobsService: AvailableJobsService,
    public jobUtilService: JobUtilervice,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.btnTitle = "Apply";
    await this.availableJobsService.getSelectedJobById();
    await this.getTotal();
  }

  async getTotal() {
    this.minTotal = 0;
    this.maxTotal = 0;
    this.availableJobsService.selectedJobDetails?.dates.forEach(date => {
      const hours = this.jobUtilService.hoursOfJob(date.timeFrom, date.timeTo);
      this.minTotal = this.minTotal + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.minRate * hours));
      this.maxTotal = this.maxTotal + Math.round(this.availableJobsService.selectedJobDetails?.basePrice + (this.availableJobsService.selectedJobDetails?.jobSeekerPaymentInfo.maxRate * hours));
    });
  }

  async applyForJob() {
    await this.availableJobsService.applyForSelectedJob(true);
  }

  disableApplyJobBtn() {
    if (this.availableJobsService.selectedJobDetails?.applicationStatus == 'PENDING'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'IN_REVIEW'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'STAND_BY'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'APPROVED'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'REJECTED') {
      this.btnTitle = "Applied";
      return true;
    } else {
      this.btnTitle = "Apply";
      return false;
    }
  }

  async bookmarkJob() {
    if (this.availableJobsService.selectedJobPreferences) {
      await this.jobBookMark();
    } else {
      await this.availableJobsService.applyForSelectedJob(false);
      await this.jobBookMark();
    }

  }

  async jobBookMark() {
    this.availableJobsService.jobPref = this.availableJobsService.selectedJobPreferences?.content[0];
    await this.availableJobsService.jobPref.jobTypePreferences.forEach(async prefType => {
      if (this.availableJobsService.selectedJobDetails?.jobTypeId == prefType.typeId) {
        let hourlyRate = prefType.maxHourlyRate;
        await this.availableJobsService.submitJobApplication(hourlyRate, true);
        await this.availableJobsService.getSelectedJobById();
      }
    })
  }

}
