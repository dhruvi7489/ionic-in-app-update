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
    this.myEarningsService.accountNumber = null;
    this.myEarningsService.confirm_accountNumber = null;
    this.myEarningsService.ifscCode = null;
    this.myEarningsService.nameOnAccount = null;
    this.myEarningsService.authorizeBankDetails = null;
    this.myEarningsService.getAccountDetails();
  }

  getAccountNumber(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.accountNumber = event.ngModelData;
  }

  getConfirmAccountNumber(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.confirm_accountNumber = event.ngModelData;
  }

  getIFSCCode(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.ifscCode = event.ngModelData;
  }

  getAccountentName(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.nameOnAccount = event.ngModelData;
  }

  authorizeBankDetails(event) {
    this.myEarningsService.authorizeBankDetails = event.ngModelData;
  }

  pasteGetAccountNumber(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.accountNumber = event.ngModelData;
  }

  pasteGetConfirmAccountNumber(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.confirm_accountNumber = event.ngModelData;
  }

  pasteGetIFSCCode(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.ifscCode = event.ngModelData;
  }

  pasteGetAccountentName(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.myEarningsService.nameOnAccount = event.ngModelData;
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
