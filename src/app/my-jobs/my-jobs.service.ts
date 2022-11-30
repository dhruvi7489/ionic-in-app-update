import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../core/common';
import { MyJob } from '../core/modal/my-job.modal';
import { Apiurl } from '../core/route';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class MyJobsService {
  myJobsList: MyJob[] = [];
  selectedTab: string = '';
  errorInApiCall: boolean = false;

  page = 0;
  pageSize = 10;
  totalMyJobsRecords = 0;
  loadedMyJobsRecords = 0;

  noDataFound: boolean = false;

  constructor(
    public commonProvider: CommonProvider,
    public loadingService: LoadingService,
    public storage: Storage
  ) {
  }

  // Get My Jobs Data
  async getMyJobs() {
    const loginUserId = await this.storage.get('loginUserId');
    await this.loadingService.show();
    let params = loginUserId + '?sort=createdOn,desc&page=' + this.page + '&size=' + this.pageSize;
    if (this.selectedTab) {
      params += '&status=' + this.selectedTab
    }
    await this.commonProvider.GetMethod(Apiurl.GetMyJobs + params, null).then(async (res: any) => {
      if (res && res.content?.length != 0) {
        await this.loadingService.dismiss();
        this.totalMyJobsRecords = res.totalElements;
        this.noDataFound = res?.content?.length != 0 ? true : false;
        this.loadedMyJobsRecords = res?.content.length;
        this.errorInApiCall = false;
        res.content.forEach((element) => {
          this.myJobsList.push(element);
        });
      } else {
        await this.loadingService.dismiss();
      }
    }).catch((err: HttpErrorResponse) => {
      this.errorInApiCall = true;
      this.myJobsList = [];
      this.page = 0;
      this.loadingService.dismiss();

    })
  }

  // Reset Data
  async resetPayload() {
    this.page = 0;
    this.pageSize = 10;
    this.loadedMyJobsRecords = 0;
    this.totalMyJobsRecords = 0;
    this.noDataFound = false;
    this.myJobsList = [];
  }
}
