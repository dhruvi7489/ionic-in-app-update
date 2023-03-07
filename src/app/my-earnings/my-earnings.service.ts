import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CommonProvider } from '../core/common';
import { JobseekerAccount } from '../core/modal/jobseeker-account.model';
import { Payment } from '../core/modal/payment.modal';
import { Apiurl } from '../core/route';
import { LoadingService } from '../core/services/loading.service';
import { ToastService } from '../core/services/toast.service';
import { WithdrawPage } from './withdraw/withdraw.page';

@Injectable({
  providedIn: 'root'
})
export class MyEarningsService {

  accountId: string = null;
  accountNumber: string = null;
  confirm_accountNumber: string = null;
  ifscCode: string = null;
  nameOnAccount: string = null;
  authorizeBankDetails: boolean = false;
  earningStatus: any = null;
  earningRecords: Payment[] = [];
  selectedTab: string = 'Unapproved';
  noEarningFound: boolean = false;

  phone_no: string = '917048450515';
  message: string = 'Hello world!';

  page = 0;
  pageSize = 10;
  totalEarningRecords = 0;
  loadedMyEarningsRecords = 0;

  availableAmountForWithdraw = null;
  wantAmountForWithdraw = null;

  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService,
    public loadingService: LoadingService,
    public modalCtrl: ModalController,
    public storage: Storage
  ) {

  }

  // Get Payment Status
  async getPaymentStatus() {
    const loginUserId = await this.storage.get('loginUserId');
    return await this.commonProvider.GetMethod(Apiurl.GetEarningStatus + loginUserId, null).then(async (res: any) => {
      if (res) {
        this.earningStatus = res;
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Get All Payment Records
  async getAllPaymentRecords() {
    const loginUserId = await this.storage.get('loginUserId');
    // this.loadingService.show();
    return await this.commonProvider.GetMethod(Apiurl.GetAllPaymentsRecords + '?' + 'jobSeekerId=' + loginUserId, null).then(async (res: any) => {
      // this.loadingService.dismiss();
      if (res) {
        this.earningRecords = res.content;
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Get All Payment Records
  async getPaymentRecords() {
    const loginUserId = await this.storage.get('loginUserId');
    // this.loadingService.show();
    let param = '?page=' + this.page + '&size=' + this.pageSize + '&sort=createdOn,desc' + '&' + 'jobSeekerId=' + loginUserId
      + '&status=' + this.selectedTab;
    return await this.commonProvider.GetMethod(Apiurl.Payment + '/' + param, null).then(async (res: any) => {
      // this.loadingService.dismiss();
      if (res) {
        this.loadedMyEarningsRecords = res?.numberOfElements;
        this.totalEarningRecords = res?.totalElements;
        res.content?.forEach(element => {
          this.earningRecords.push(element);
        });
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Go To Contact
  async goToContact() {

  }

  // Reset Data
  resetPayload() {
    this.page = 0;
    this.pageSize = 10;
    this.totalEarningRecords = 0;
    this.loadedMyEarningsRecords = 0;
    this.earningRecords = [];
  }

  // Get Job Seeker Account Details
  async getAccountDetails() {
    const loginUserId = await this.storage.get('loginUserId');
    this.loadingService.show();
    await this.commonProvider.GetMethod(Apiurl.GetAccountDetails + loginUserId, null).then(async (res: any) => {
      this.loadingService.dismiss();
      if (res) {
        this.accountId = res?.id;
        this.accountNumber = res?.accountNumber;
        this.confirm_accountNumber = res?.accountNumber;
        this.ifscCode = res?.ifscCode;
        this.nameOnAccount = res?.nameOnAccount;
        this.authorizeBankDetails = res?.authorizeBankDetails;
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Save Account Details
  async saveAccountDetails() {
    const loginUserId = await this.storage.get('loginUserId');
    this.loadingService.show();
    if (this.accountId) {
      let obj: JobseekerAccount = {
        "accountNumber": this.accountNumber,
        "ifscCode": this.ifscCode,
        "nameOnAccount": this.nameOnAccount,
        "authorizeBankDetails": this.authorizeBankDetails,
        "jobSeekerId": loginUserId,
      }
      await this.commonProvider.PutMethod(Apiurl.UpdateAccountDetails + this.accountId, obj).then(async (res: any) => {
        this.loadingService.dismiss();
        if (res) {
          this.getAccountDetails();
          // this.modalCtrl.dismiss();
          this.withdrawAmountPage();
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    } else {
      let obj: JobseekerAccount = {
        "accountNumber": this.accountNumber,
        "ifscCode": this.ifscCode,
        "nameOnAccount": this.nameOnAccount,
        "authorizeBankDetails": this.authorizeBankDetails,
        "jobSeekerId": loginUserId,
      }
      await this.commonProvider.PostMethod(Apiurl.SaveAccountDetails, obj).then(async (res: any) => {
        this.loadingService.dismiss();
        if (res) {
          this.getAccountDetails();
          // this.modalCtrl.dismiss();
          this.withdrawAmountPage();
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    }
  }

  // Withdraw amount page
  async withdrawAmountPage() {
    const modal = await this.modalCtrl.create({
      component: WithdrawPage,
      componentProps: null
    })
    await modal.present();
  }

  // Fetch user wallet
  async fetchUserWallet() {
    const loginUserId = await this.storage.get('loginUserId');
    this.commonProvider.GetMethod(Apiurl.GetWalletBalance + loginUserId, null).then((res: any) => {
      if (res) {
        if (res.statusCode == '200' || res.statusCode == '201') {
          this.availableAmountForWithdraw = res?.result?.walletBalance;
        } else {
          this.availableAmountForWithdraw = 0;
        }
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Fetch user wallet Transection details
  async fetchUserPayouts() {
    const loginUserId = await this.storage.get('loginUserId');
    this.loadingService.show();
    let param = loginUserId + '?pageNumber=' + this.page + '&pageSize=' + this.pageSize + '&sortBy=updatedAt';
    // + '&asc=' + true;
    this.commonProvider.GetMethod(Apiurl.GetPayoutHistory + param, null).then((res: any) => {
      this.loadingService.dismiss();
      res?.result.forEach(element => {
        element.bankDetails = JSON.parse(JSON.parse(element?.payoutMeta)?.bankAccountDetails);
      });
      this.loadedMyEarningsRecords = this.pageSize;
      this.totalEarningRecords = res?.totalRecords;
      res.result?.forEach(element => {
        this.earningRecords.push(element);
      });
      console.log(this.earningRecords)
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Send request for withdrawal
  async withdrawAmount() {
    const loginUserId = await this.storage.get('loginUserId');
    let param = {
      "userId": loginUserId,
      "amount": this.wantAmountForWithdraw
    }
    this.loadingService.show();
    this.commonProvider.PostMethod(Apiurl.WithdrawAmount, param).then((res: any) => {
      this.toastService.showMessage("Your withdrawal request sent successfully!")
      this.loadingService.dismiss();
      this.modalCtrl.dismiss();
      this.wantAmountForWithdraw = null;
      setTimeout(() => {
        this.modalCtrl.dismiss();
        this.selectedTab = 'Unapproved';
        this.fetchUserWallet();
        this.fetchUserPayouts();
      }, 500);
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }
}
