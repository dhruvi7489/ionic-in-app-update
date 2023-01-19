import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { JobUtilervice } from 'src/app/core/util/job-util.service';
import { ToastService } from 'src/app/core/services/toast.service';
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
    public toastService: ToastService,
    public storage: Storage
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.btnTitle = "Apply";
    this.availableJobsService.getSelectedJobById();
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

  async applyForJob() {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    // if (JSON.parse(loginUserInfo)?.status != 'Active') {
    //   this.toastService.showMessage(`You can't apply to this job now, please wait for approval.`)
    //   return;
    // }
    if (JSON.parse(loginUserInfo)?.status == 'Pending' && this.availableJobsService?.selectedJobDetails?.jobSeekerPaymentInfo?.level == "Beginner") {
      await this.availableJobsService.JobPreference(true);
    }
    else if (JSON.parse(loginUserInfo)?.status != 'Active' && this.availableJobsService?.selectedJobDetails?.jobSeekerPaymentInfo?.level != "Beginner") {
      this.toastService.showMessage("You can't apply to this job now because this job is open for " + this.availableJobsService?.selectedJobDetails?.jobSeekerPaymentInfo?.level + " level, please wait for profile approval.")
      return;
    }
    else {
      await this.availableJobsService.JobPreference(true);
    }
  }

  disableApplyJobBtn() {
    if (this.availableJobsService.selectedJobDetails?.applicationStatus == 'PENDING'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'IN_REVIEW'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'STAND_BY'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'APPROVED'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'REJECTED'
      || this.availableJobsService.selectedJobDetails?.applicationStatus == 'COMPLETED') {
      this.btnTitle = "Applied";
      return true;
    } else {
      this.btnTitle = "Apply";
      return false;
    }
  }

  async bookmarkJob() {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    // if (JSON.parse(loginUserInfo)?.status != 'Active') {
    //   this.toastService.showMessage(`You can't save this job now, please wait for approval.`)
    //   return;
    // }
    if (JSON.parse(loginUserInfo)?.status == 'Pending' && this.availableJobsService?.selectedJobDetails?.jobSeekerPaymentInfo?.level == "Beginner") {
      await this.availableJobsService.JobPreference(true);
    }
    else if (JSON.parse(loginUserInfo)?.status != 'Active' && this.availableJobsService?.selectedJobDetails?.jobSeekerPaymentInfo?.level != "Beginner") {
      this.toastService.showMessage("You can't apply to this job now because this job is open for " + this.availableJobsService?.selectedJobDetails?.jobSeekerPaymentInfo?.level + " level, please wait for profile approval.")
      return;
    }
    else {
      if (this.availableJobsService.selectedJobPreferences) {
        await this.jobBookMark();
      } else {
        await this.availableJobsService.JobPreference(false);
        await this.jobBookMark();
      }
    }
  }

  async jobBookMark() {
    this.availableJobsService.jobPref = this.availableJobsService.selectedJobPreferences?.content[0];
    await this.availableJobsService?.jobPref?.jobTypePreferences?.forEach(async prefType => {
      if (this.availableJobsService.selectedJobDetails?.jobTypeId == prefType.typeId) {
        let hourlyRate = prefType.maxHourlyRate;
        await this.availableJobsService.submitJobApplication(hourlyRate, true);
      }
    })
  }

  async removeBookmark() {
    await this.availableJobsService.removeBookMark();
  }
}
