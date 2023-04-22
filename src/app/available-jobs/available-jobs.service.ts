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
import { LoadingService } from '../core/services/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { JobUtilervice } from '../core/util/job-util.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvailableJobsService {

  jobLists: any[] = [];
  errorInApiCall: boolean = false;
  employmentId: string = null;
  jobApplicationId: string = null;
  selectedJobDetails: any = null;
  selectedJobPreferences: any = null;
  jobPref: any = null;
  jobSeeker: JobSeeker;

  pageSize = 10;
  page = 0;
  totalAvailableRecords = 0;
  loadedMyAvailablesRecords = 0;

  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService,
    public modalCtrl: ModalController,
    public loadingService: LoadingService,
    public storage: Storage,
    public jobUtilService: JobUtilervice
  ) {
    this.storage.create();
    this.setInitialValues();
  }

  // Jobseeker data get from storage
  async setInitialValues() {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    this.jobSeeker = loginUserInfo;
  }

  // Get all jobs list
  async getAllJobsList(search?) {
    const loginUserGender = await this.storage.get('loginUserGender');
    if (search) {
      this.jobLists = [];
      this.page = 0;
    }
    this.loadingService.show();
    let params = '?sort=createdOn,desc&page=' + this.page + '&size=' + this.pageSize;
    let param = { "gender": loginUserGender, "query": search }
    this.commonProvider.PostMethod(Apiurl.GetJobsList + params, param).then((res: any) => {
      this.loadingService.dismiss();
      // this.jobLists = [];
      if (res && res.content?.length != 0) {
        // this.jobLists = res.content;
        this.totalAvailableRecords = res?.totalElements;
        this.loadedMyAvailablesRecords = res?.content?.length;
        this.errorInApiCall = false;
        res.content?.forEach((element) => {
          this.jobLists.push(element);
        });
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      this.jobLists = [];
      this.page = 0;
      this.errorInApiCall = true;
      console.log(err);
    })
  }

  // Get job by job id and login user id
  async getSelectedJobById(employmentId?) {
    const loginUserId = await this.storage.get('loginUserId');
    const loginUserGender = await this.storage.get('loginUserGender');
    this.employmentId = this.router.url.split('available-job-details/')[1] ? this.router.url.split('available-job-details/')[1] : employmentId;
    this.selectedJobDetails = null;
    this.jobApplicationId = null;

    if (!employmentId) {
      this.loadingService.show();
    }
    if (this.employmentId && loginUserId) {
      let params = this.employmentId + '/' + loginUserId;
      let param = { "gender": loginUserGender }
      this.commonProvider.GetMethod(Apiurl.GetJobByJobId + params, param).then((res: any) => {
        this.loadingService.dismiss();
        if (res) {
          this.selectedJobDetails = res;
          this.jobApplicationId = this.selectedJobDetails?.jobApplicationId;
          this.selectedJobDetails?.dates?.forEach(date => {
            this.jobUtilService.shiftDayChange(date.date, date.timeFrom, date.timeTo);
          })
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    } else {
      // this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
      this.loadingService.dismiss();
      this.toastService.showMessage("Employment Id not found!")
    }
  }

  // Get job by job id and login user id globally
  async getSelectedJobByIdGlobally() {
    // const loginUserId = await this.storage.get('loginUserId');
    // const loginUserGender = await this.storage.get('loginUserGender');
    this.employmentId = this.router.url.split('available-job-details-global/')[1];
    this.selectedJobDetails = null;
    this.jobApplicationId = null;

    this.loadingService.show();
    if (this.employmentId) {
      let params = this.employmentId;
      this.commonProvider.GetMethod(Apiurl.GetJobDetailsGlobally + params, null).then((res: any) => {
        this.loadingService.dismiss();
        if (res) {
          this.selectedJobDetails = res;
          this.jobApplicationId = this.selectedJobDetails?.jobApplicationId;
          this.selectedJobDetails?.dates?.forEach(date => {
            this.jobUtilService.shiftDayChange(date.date, date.timeFrom, date.timeTo);
          })
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    } else {
      // this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
      this.loadingService.dismiss();
      this.toastService.showMessage("Employment Id not found!")
    }
  }


  // Apply for selected job
  async JobPreference(isDetailPage?: boolean) {
    const loginUserId = await this.storage.get('loginUserId');
    await this.loadingService.show();
    let params = '?page=0&size=1&sort=createdOn,desc&jobSeekerId=' + loginUserId;
    await this.commonProvider.GetMethod(Apiurl.JobPreference + params, null).then(async (res: any) => {
      await this.loadingService.dismiss();
      let typeIdFound = false;
      if (res) {
        this.selectedJobPreferences = res;
        if (isDetailPage) {
          this.logicForValidToApplyJob(res, typeIdFound);
        }
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Login user eligible for apply job or not that logic set here
  async logicForValidToApplyJob(res, typeIdFound) {
    await this.loadingService.show();
    if (res && res.content.length != 0 && res.content[0]?.jobTypePreferences?.length != 0) {
      await this.loadingService.dismiss();
      for (let pref of res?.content[0]?.jobTypePreferences) {
        // if (pref.typeId == this.selectedJobDetails?.jobTypeId) {
        typeIdFound = true;
        if (this.selectedJobDetails?.jobSeekerPaymentInfo?.level == 'Expert') {
          if (pref.level == 'Expert') {
            this.goToSetHourlyRate();
            return;
          }
          else {
            this.toastService.showMessage('You can not apply to this job. Your level is not suitable for this job type.');
            return;
          }
        }
        else if (this.selectedJobDetails?.jobSeekerPaymentInfo?.level == 'Intermediate') {
          if (pref.level == 'Intermediate' || pref.level == 'Expert') {
            this.goToSetHourlyRate();
            return;
          }
          else {
            this.toastService.showMessage('You can not apply to this job. Your level is not suitable for this job type.');
            return;
          }
        }
        else if (this.selectedJobDetails?.jobSeekerPaymentInfo?.level == 'Beginner') {
          this.goToSetHourlyRate();
          return;
        }
        else {
          this.toastService.showMessage('Something went wrong, try again later.');
          return;
        }
        // }
      }
    } else {
      await this.loadingService.dismiss();
      if (this.selectedJobDetails?.jobSeekerPaymentInfo?.level == 'Beginner') {
        this.goToSetHourlyRate();
        return;
      }
    }
    // if (!typeIdFound) {
    //   await this.toastService.showMessage('You can not apply to this job, your profile not approved for this Job Type');
    // }
  }

  // Go to set hourly rate page
  async goToSetHourlyRate() {
    const isDateMatched = await this.betweenTimeCheck();
    if (!isDateMatched) {
      await this.router.navigateByUrl("set-hourly-rate")
    } else {
      this.toastService.showMessage('You can not apply to this job. You already applied to another job for same date and time.');
      return;
    }
  }

  // Logic for start and endtime check 
  async betweenTimeCheck(): Promise<boolean> {
    this.loadingService.show();
    const loginUserId = await this.storage.get('loginUserId');
    let isFound = false;
    const jobDates = this.selectedJobDetails?.dates.map(date => ({
      timeFrom: DateTime.local(date?.date[0], date?.date[1], date?.date[2], date?.timeFrom[0], date?.timeFrom[1]),
      timeTo: DateTime.local(date?.date[0], date?.date[1], date?.date[2], date?.timeTo[0], date?.timeTo[1])
    }));
    let params = loginUserId + '?sort=createdOn,desc&page=0&size=10000&status=APPROVED'
    await this.commonProvider.GetMethod(Apiurl.GetMyJobs + params, null).then(async (res: any) => {
      this.loadingService.dismiss();
      await res?.content?.forEach(job => {
        job.dates.forEach(date => {
          const jobDateStart = DateTime.local(date?.date[0], date?.date[1], date?.date[2], date?.timeFrom[0], date?.timeFrom[1]);
          const jobDateEnd = DateTime.local(date?.date[0], date?.date[1], date?.date[2], date?.timeTo[0], date?.timeTo[1]);
          jobDates.forEach(jobDates => {
            if ((jobDateStart >= jobDates.timeFrom && jobDateStart <= jobDates.timeTo) || (jobDateEnd >= jobDates.timeFrom && jobDateEnd <= jobDates.timeTo)) {
              return isFound = true;
            }
          });
        });
      });

    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
    return isFound;
  }

  // update hourly rates
  async updateHourlyRateRange(hourlyRate, isApplyLater) {
    this.loadingService.show();
    if (this.jobPref?.jobTypePreferences?.length == 0) {
      this.loadingService.dismiss();
      let jobTypePreferencesRequests = [];
      let data = {
        "typeId": this.selectedJobDetails?.jobTypeId,
        "typeName": this.selectedJobDetails?.jobTypeName,
      }
      jobTypePreferencesRequests.push(data);
      let params = {
        "jobSeekerId": await this.storage.get('loginUserId'),
        "jobTypeRequests": jobTypePreferencesRequests
      }
      this.commonProvider.PutMethod(Apiurl.JobPreference + '/' + this.jobPref.id, params).then(async (res: any) => {
        await this.loadingService.dismiss();
        await this.submitJobApplication(hourlyRate, isApplyLater);
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    } else {
      let jobTypePreferencesRequests = [];

      this.jobPref?.jobTypePreferences?.forEach(element => {
        let data = {
          "typeId": element?.typeId,
          "typeName": element?.typeName,
        }
        jobTypePreferencesRequests.push(data);
      })

      let JobTypeNotMatched = false;

      this.jobPref?.jobTypePreferences?.forEach(async (element) => {
        if (element.typeId != this.selectedJobDetails?.jobTypeId) {
          JobTypeNotMatched = true;
        } else {
          JobTypeNotMatched = false;
        }
      });

      if (JobTypeNotMatched) {
        this.saveJobPreferences(jobTypePreferencesRequests, hourlyRate, isApplyLater);
      } else {
        this.commonProvider.PostMethod(Apiurl.UpdateHourlyRate + this.jobPref.id, { jobTypeHourlyRateRequests: this.jobPref?.jobTypePreferences }).then((res: any) => {
          this.loadingService.dismiss();
          if (res) {
            this.submitJobApplication(hourlyRate, isApplyLater);
          }
        }).catch((err: HttpErrorResponse) => {
          this.loadingService.dismiss();
          console.log(err);
        })
      }
    }
  }

  async saveJobPreferences(jobTypePreferencesRequests, hourlyRate, isApplyLater) {
    let data = {
      "typeId": this.selectedJobDetails?.jobTypeId,
      "typeName": this.selectedJobDetails?.jobTypeName,
    }
    jobTypePreferencesRequests.push(data);
    let params = {
      "jobSeekerId": await this.storage.get('loginUserId'),
      "jobTypeRequests": jobTypePreferencesRequests
    }
    this.commonProvider.PutMethod(Apiurl.JobPreference + '/' + this.jobPref.id, params).then(async (res: any) => {
      await this.loadingService.dismiss();
      this.commonProvider.PostMethod(Apiurl.UpdateHourlyRate + this.jobPref.id, { jobTypeHourlyRateRequests: this.jobPref?.jobTypePreferences }).then((res: any) => {
        this.submitJobApplication(hourlyRate, isApplyLater);
      }).catch((err: HttpErrorResponse) => {
        console.log(err);
      })
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Apply for job & submit job application
  async submitJobApplication(hourlyRate, isApplyLater) {
    const loginUserId = await this.storage.get('loginUserId');
    const loginUserGender = await this.storage.get('loginUserGender');
    this.loadingService.show();
    let application: JobApplication = new JobApplication();
    application.employmentId = this.employmentId
    application.jobSeekerId = loginUserId;
    application.isApplyLater = isApplyLater;
    application.hourlyRate = hourlyRate || 0;
    application.gender = loginUserGender;
    if (application.hourlyRate != 0) {
      this.commonProvider.PostMethod(Apiurl.SubmitJobApplication, application).then(async (res: any) => {
        await this.loadingService.dismiss();
        if (!isApplyLater) {
          if (res && res.id) {
            let obj = {
              title: "Job application successful",
              message: "Congratulations, Your job application is now submitted and awaiting for approval. we will inform you as soon as it is approved.",
              okBtnText: "Apply for another Job",
              cancelBtnText: "Close",
              img: "../../assets/imgs/job-application-successful.svg",
              success: true
            }
            const modal = await this.modalCtrl.create({
              component: JobApplicationModalPage,
              componentProps: obj
            });
            await modal.present();
          } else {
            let obj = {
              title: "Job application failed",
              message: "Your job application failed.Please try again later. If this continues to be a problem, please reach out to customer support.",
              okBtnText: "Try again",
              cancelBtnText: "Close",
              img: "../../assets/imgs/job-application-failed.svg",
              hourlyRate: hourlyRate,
              isApplyLater: isApplyLater,
              success: false
            }
            const modal = await this.modalCtrl.create({
              component: JobApplicationModalPage,
              componentProps: obj
            });
            await modal.present();
          }
        } else {
          await this.toastService.showMessage('You saved this job for later use!');
          await this.getSelectedJobById();
        }

      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    } else {
      await this.loadingService.dismiss();
      await this.toastService.showMessage('Please select valid hourly rate!');
    }
  }

  //Remove Bookmarked
  removeBookMark() {
    if (this.jobApplicationId) {
      this.commonProvider.PutMethod(Apiurl.RemoveBookMark + this.jobApplicationId, null).then((res: any) => {
        this.getSelectedJobById();
      }).catch((err: HttpErrorResponse) => {
        console.log(err);
      })
    } else {
    }
  }

  // Share job details to Whatsapp
  async shareSelectedJobDetails() {
    let url = this.router.url
    url = this.router.url.replace('available-job-details', 'available-job-details-global');
    let pageUrl = encodeURIComponent(url);
    let jobType = encodeURIComponent(this.selectedJobDetails?.jobTypeName);

    // send message in App whatsapp
    // window.open("https://api.whatsapp.com/send/?text=Hey!%20I%20found%20a%20" + jobType + "%20job%20on%20hour4U.%20check%20it%20out%20here%20%F0%9F%91%87%0A%20https%3A%2F%2Fuatapp.hour4u.com" + pageUrl);

    // send message in Web whatsapp
    if (Capacitor.getPlatform() == 'web') {
      let webUrl = 'https%3A%2F%2Fuatapp.hour4u.com/#';
      if (environment.apiUrl == 'https://uatapi.hour4u.com/api/') { // UAT 
        webUrl = 'https%3A%2F%2Fuatapp.hour4u.com/#';
      }
      if (environment.apiUrl == 'https://api.hour4u.com/api/') { // PROD
        webUrl = 'https%3A%2F%2Fapp.hour4u.com/#';
      }
      window.open("https://web.whatsapp.com/send/?text=Hey!%20I%20found%20a%20" + jobType + "%20job%20on%20hour4U.%20check%20it%20out%20here%20%F0%9F%91%87%0A%20" + webUrl + pageUrl);
    }

    // send message in social share
    if (Capacitor.getPlatform() !== 'web') {
      let webUrl = 'https://uatapp.hour4u.com/#';
      if (environment.apiUrl == 'https://uatapi.hour4u.com/api/') { // UAT 
        webUrl = 'https://uatapp.hour4u.com/#';
      }
      if (environment.apiUrl == 'https://api.hour4u.com/api/') { // PROD
        webUrl = 'https://app.hour4u.com/#';
      }
      await Share.share({
        title: jobType,
        text: 'Hey! I found ' + this.selectedJobDetails?.jobTypeName + ' job on Hour4U. check it out here 👇\n',
        url: webUrl + url,
        dialogTitle: 'hour4u.com',
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
