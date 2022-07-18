import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonProvider } from '../core/common';
import { Apiurl } from '../core/route';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class MyEarningsService {

  account_number: string = null;
  confirm_account_number: string = null;
  ifsc_code: string = null;
  accountent_name: string = null;
  authorize_bank_details: boolean = false;
  earningStatus: any = null;
  allEarningRecords: any[] = [];
  earningRecords: any[] = [];
  selectedTab: string = 'Unapproved';
  noEarningFound: boolean = false;

  phone_no: string = '917048450515';
  message: string = 'Hello world!';
  
  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService
  ) { }

  async getPaymentStatus() {
    return await this.commonProvider.GetMethod(Apiurl.GetEarningStatus + '/' + localStorage.getItem('loginUserId'), null).then(async (res: any) => {
      if (res) {
        this.earningStatus = res;
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async getPaymentRecords() {
    let param = '?page=0&size=1100&sort=createdOn,desc' + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId');
    return await this.commonProvider.GetMethod(Apiurl.Payment + '/' + param, null).then(async (res: any) => {
      if (res) {
        this.allEarningRecords = res?.content;
        await this.tabChangeHandle();
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async tabChangeHandle() {
    if (this.allEarningRecords) {
      this.earningRecords = await this.allEarningRecords.filter(data => {
        return data.status == this.selectedTab
      })
    }
  }

  async goToContact() {

  }
}
