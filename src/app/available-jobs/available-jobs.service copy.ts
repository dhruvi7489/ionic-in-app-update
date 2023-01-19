import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonProvider } from '../core/common';
import { Apiurl } from '../core/route';
import { ToastService } from '../core/services/toast.service';
import { DateTime } from 'luxon';
import { JobApplicationModalPage } from './job-application-modal/job-application-modal.page';
import { ModalController } from '@ionic/angular';
import { JobApplication } from '../core/modal/job-application.modal';
import { JobSeeker } from '../core/modal/job-seeker.modal';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AvailableJobsService {

  jobLists: any[] = [];
  errorInApiCall: boolean = false;
  selectedJobId: string = null;
  selectedJobDetails: any = null;
  selectedJobPreferences: any = null;
  jobPref: any = null;
  jobSeeker: JobSeeker;

  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService,
    public modalCtrl: ModalController,
    public storage: Storage
  ) {
    this.setInitialValues();
  }

  async setInitialValues() {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    this.jobSeeker = JSON.parse(loginUserInfo)
  }

  async getAllJobsList(search?) {
    const loginUserGender = await this.storage.get('loginUserGender');
    let params = '?sort=createdOn,desc&page=0&size=11000';
    let param = { "gender": loginUserGender, "query": search }
    return await this.commonProvider.PostMethod(Apiurl.GetJobsList + params, param).then(async (res: any) => {
      this.jobLists = [];
      if (res && res.length != 0) {
        this.jobLists = res;
        this.errorInApiCall = false;
      }
    }).catch((err: any) => {
      this.errorInApiCall = true;
      console.log(err);
    })
  }

  async getSelectedJobById() {
    const loginUserGender = await this.storage.get('loginUserGender');
    const loginUserId = await this.storage.get('loginUserId');
    if (this.selectedJobId && loginUserId) {
      let params = this.selectedJobId + '/' + loginUserId;
      let param = { "gender": loginUserGender }
      return await this.commonProvider.GetMethod(Apiurl.GetJobByJobId + params, param).then(async (res: any) => {
        if (res) {
          this.selectedJobDetails = res;
          this.errorInApiCall = false;
        }
      }).catch((err: any) => {
        this.errorInApiCall = true;
        console.log(err);
      })
    } else {
      this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
    }
  }

  async JobPreference(isDetailPage?: boolean) {
    const loginUserId = await this.storage.get('loginUserId');
    let params = '?page=0&size=1&sort=createdOn,desc&jobSeekerId=' + loginUserId;
    return await this.commonProvider.GetMethod(Apiurl.JobPreference + params, null).then(async (res: any) => {
      let typeIdFound = false;
      if (res) {
        this.selectedJobPreferences = res;
        if (isDetailPage) {
          await this.logicForValidToApplyJob(res, typeIdFound);
        }
      }
    }).catch((err: any) => {
      this.errorInApiCall = true;
      console.log(err);
    })
  }

  async logicForValidToApplyJob(res, typeIdFound) {
    for (let pref of res.content[0].jobTypePreferences) {
      if (pref.typeId == this.selectedJobDetails?.jobTypeId) {
        typeIdFound = true;
        if (this.selectedJobDetails.jobSeekerPaymentInfo.level == 'Expert') {
          if (pref.level == 'Expert')
            this.goToSetHourlyRate();
          else {
            this.toastService.showMessage('You can not apply to this job. Your level is not suitable for this job type.');
            return;
          }
        }
        else if (this.selectedJobDetails?.jobSeekerPaymentInfo.level == 'Intermediate') {
          if (pref.level == 'Intermediate' || pref.level == 'Expert')
            this.goToSetHourlyRate();
          else {
            this.toastService.showMessage('You can not apply to this job. Your level is not suitable for this job type.');
            return;
          }
        }
        else if (this.selectedJobDetails?.jobSeekerPaymentInfo.level == 'Beginner') {
          this.goToSetHourlyRate();
        }
        else {
          this.toastService.showMessage('Something went wrong, try again later.');
          return;
        }
      }
    }
    if (!typeIdFound) {
      await this.toastService.showMessage('You can not apply to this job, your profile not approved for this Job Type');
    }
  }

  async goToSetHourlyRate() {
    const isDateMatched = await this.betweenTimeCheck();
    if (!isDateMatched) {
      await this.router.navigateByUrl("set-hourly-rate")
    } else {
      this.toastService.showMessage('You can not apply to this job. You already applied to another job for same date and time.');
      return;
    }
  }

  async betweenTimeCheck(): Promise<boolean> {
    let isFounnd = false;
    const loginUserId = await this.storage.get('loginUserId');
    const jobDates = this.selectedJobDetails.dates.map(date => ({
      timeFrom: DateTime.local(date.date[0], date.date[1], date.date[2], date.timeFrom[0], date.timeFrom[1]),
      timeTo: DateTime.local(date.date[0], date.date[1], date.date[2], date.timeTo[0], date.timeTo[1])
    }));
    let params = loginUserId + '?sort=createdOn,desc&page=0&size=10000&status=APPROVED'
    await this.commonProvider.GetMethod(Apiurl.GetMyJobs + params, null).then(async (res: any) => {
      await res.forEach(job => {
        job.dates.forEach(date => {
          const jobDateStart = DateTime.local(date.date[0], date.date[1], date.date[2], date.timeFrom[0], date.timeFrom[1]);
          const jobDateEnd = DateTime.local(date.date[0], date.date[1], date.date[2], date.timeTo[0], date.timeTo[1]);
          jobDates.forEach(jobDates => {
            if ((jobDateStart >= jobDates.timeFrom && jobDateStart <= jobDates.timeTo) || (jobDateEnd >= jobDates.timeFrom && jobDateEnd <= jobDates.timeTo)) {
              return isFounnd = true;
            }
          });
        });
      });

    }).catch(err => {

    })
    return isFounnd;
  }

  async updateHourlyRateRange(hourlyRate, isApplyLater) {
    return await this.commonProvider.PostMethod(Apiurl.UpdateHourlyRate + this.jobPref.id, { jobTypeHourlyRateRequests: this.jobPref?.jobTypePreferences }).then(async (res: any) => {
      if (res) {
        this.errorInApiCall = false;
        this.submitJobApplication(hourlyRate, isApplyLater);
      }
    }).catch((err: any) => {
      this.errorInApiCall = true;
      console.log(err);
    })
  }

  async submitJobApplication(hourlyRate, isApplyLater) {
    const loginUserId = await this.storage.get('loginUserId');
    const loginUserGender = await this.storage.get('loginUserGender');
    let application: JobApplication = new JobApplication();
    application.employmentId = this.selectedJobId
    application.jobSeekerId = loginUserId;
    application.isApplyLater = isApplyLater;
    application.hourlyRate = hourlyRate;
    application.gender = loginUserGender;

    return await this.commonProvider.PostMethod(Apiurl.SubmitJobApplication, application).then(async (res: any) => {
      if (res && res.id) {
        this.errorInApiCall = false;
        if (!isApplyLater) {
          let obj = {
            title: "Job application successful",
            message: "Congratulations, Your job application is now submitted and awaiting for approval. we will inform you as soon as it is approved.",
            okBtnText: "Apply for another Job",
            cancelBtnText: "Close",
            img: "../../assets/imgs/job-application-successful.svg"
          }
          const modal = await this.modalCtrl.create({
            component: JobApplicationModalPage,
            componentProps: obj
          });
          await modal.present();
        }
      } else {
        if (!isApplyLater) {
          let obj = {
            title: "Job application failed",
            message: "Your job application failed.Please try again later. If this continues to be a problem, please reach out to customer support.",
            okBtnText: "Try again",
            cancelBtnText: "Close",
            img: "../../assets/imgs/job-application-failed.svg",
            hourlyRate: hourlyRate,
            isApplyLater: isApplyLater
          }
          const modal = await this.modalCtrl.create({
            component: JobApplicationModalPage,
            componentProps: obj
          });
          await modal.present();
        }
      }
    }).catch((err: any) => {
      this.errorInApiCall = true;
      console.log(err);
    })
  }
}
