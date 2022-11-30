import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../core/common';
import { JobPreference, JobTypePreference } from '../core/modal/job-preference.modal';
import { JobType } from '../core/modal/job-type.modal';
import { Apiurl } from '../core/route';
import { ProfileService } from '../profile/profile.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class SetHourlyRatesService {
  jobPreferences: JobTypePreference[];
  jobPreferenceId: string = null;
  hoursArray: any[] = [
    {
      id: 1,
      hour: 2,
      displayName: '2 hours'
    },
    {
      id: 1,
      hour: 4,
      displayName: '4 hours'
    },
    {
      id: 1,
      hour: 8,
      displayName: '8 hours'
    },
    {
      id: 1,
      hour: 12,
      displayName: '12 hours'
    }
  ]
  constructor(
    public commonProvider: CommonProvider,
    public loadingService: LoadingService,
    public modalCtrl: ModalController,
    public profileService: ProfileService,
    public toastService: ToastService,
    public storage: Storage
  ) {

  }

  // GET job preferences Detailss
  async getJobPreferences() {
    const loginUserId = await this.storage.get('loginUserId');
    return await this.commonProvider.GetMethod(Apiurl.GetDetailsByJobSeekerId + loginUserId, null).then(async (res: any) => {
      console.log(res)
      if (res) {
        this.jobPreferenceId = res.jobPreferenceId;
        this.jobPreferences = [];
        res?.jobTypePreferences.forEach((ele: any) => {
          ele.shiftHours = 8;
          ele.finalAmount = this.calculateFinalAmount(ele.basePrice, ele.maxHourlyRate, ele.shiftHours);
          this.jobPreferences.push(ele);
        })
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  // Calculate Final Amount based on selected hours
  calculateFinalAmount(basePrice, maxHourlyRate, shiftHours) {
    return basePrice + (maxHourlyRate * shiftHours);
  }

  // Apply for selected job
  // async getJobPreference() {
  // const loginUserId = await this.storage.get('loginUserId');
  //   let params = '?page=0&size=1&sort=createdOn,desc&jobSeekerId=' + loginUserId;
  //   return await this.commonProvider.GetMethod(Apiurl.JobPreference + params, null).then(async (res: any) => {
  //     if (res) {
  //       this.jobPreferences = [];
  //       res.content[0]?.jobTypePreferences.forEach((ele: any) => {
  //         ele.shiftHours = 8;
  //         ele.finalAmount = ele.maxHourlyRate + (ele.maxHourlyRate * ele.shiftHours)
  //         this.jobPreferences.push(ele);
  //       })
  //       console.log(this.jobPreferences)
  //     }
  //   }).catch((err: HttpErrorResponse) => {
  //     console.log(err)
  //   })
  // }

  async getMinMaxFromJobType(jobType: JobType, level: string) {
    // console.log('level ::: ', level);
    let obj;
    //console.log('getMinMaxFromJobType::jobType ', jobType)
    if (jobType) {
      const loginUserGender = await this.storage.get('loginUserGender');
      //console.log('iiterate prices')
      jobType.jobSeekerPrices.forEach(element => {
        // console.log('price info::: ', element);
        if (element.gender.toLowerCase() == loginUserGender.toLowerCase()) {
          element.jobTypeHourlyPriceRange.forEach(priceRange => {
            //console.log('priceRange::: ', priceRange);
            if (priceRange.level.toLowerCase() == level.toLowerCase()) {
              obj = priceRange;
              return;
            }
          })
        }
      });
    }
    //console.log('obj::', obj);
    return obj;
  }



  // Set Hourly Rates 
  setHourlyRates() {
    // update hourly rates
    this.loadingService.show();
    let typePreferences = [];
    this.jobPreferences.forEach(hours => {
      typePreferences.push(
        {
          maxHourlyRate: hours.maxHourlyRate,
          level: hours.level,
          status: hours.status,
          typeId: hours.typeId,
          typeName: hours.typeName
        });
    });
    this.commonProvider.PostMethod(Apiurl.UpdateHourlyRate + this.jobPreferenceId, { jobTypeHourlyRateRequests: this.jobPreferences }).then((res: any) => {
      if (res) {
        this.getJobPreferences();
        this.profileService.getJobPreference();
        this.modalCtrl.dismiss();
        this.loadingService.dismiss();
      }
    }).catch((err: HttpErrorResponse) => {
      this.toastService.showMessage(err.error.message + ' ' + (err.error?.subErrors.length != 0 ? err.error?.subErrors[0]?.message : ''));
      this.loadingService.dismiss();
    })
  }
}
