import { Component, OnInit } from '@angular/core';
import { MyEarningsService } from '../my-earnings.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  disabled: boolean = false;

  constructor(
    public myEarningsService: MyEarningsService,
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.myEarningsService.getAccountDetails();
  }

  getAccountNumber(event) {
    this.myEarningsService.accountNumber = event.ngModelData;
  }

  getConfirmAccountNumber(event) {
    this.myEarningsService.confirm_accountNumber = event.ngModelData;
  }

  getIFSCCode(event) {
    this.myEarningsService.ifscCode = event.ngModelData;
  }

  getAccountentName(event) {
    this.myEarningsService.nameOnAccount = event.ngModelData;
  }

  authorizeBankDetails(event) {
    this.myEarningsService.authorizeBankDetails = event.ngModelData;
  }

  saveAccountFormDetails() {
    this.myEarningsService.saveAccountDetails();
  }

  disable() {
    this.disabled = true;
    if (this.myEarningsService?.accountNumber && this.myEarningsService?.confirm_accountNumber && this.myEarningsService?.ifscCode &&
      this.myEarningsService?.nameOnAccount && this.myEarningsService?.authorizeBankDetails == true &&
      this.myEarningsService?.confirm_accountNumber == this.myEarningsService?.accountNumber) {
      this.disabled = false;
    }
    return this.disabled;
  }

  skip() {
    this.myEarningsService.withdrawAmountPage();
  }
}
