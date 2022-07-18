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
    public myEarningsService: MyEarningsService
  ) { }

  ngOnInit() {
  }

  getAccountNumber(event) {
    this.myEarningsService.account_number = event.ngModelData;
  }

  getConfirmAccountNumber(event) {
    this.myEarningsService.confirm_account_number = event.ngModelData;
  }

  getIFSCCode(event) {
    this.myEarningsService.ifsc_code = event.ngModelData;
  }

  getAccountentName(event) {
    this.myEarningsService.accountent_name = event.ngModelData;
  }

  authorizeBankDetails(event) {
    console.log(event)
    this.myEarningsService.authorize_bank_details = event.ngModelData;
  }

  savePaymentAccountForm() {

  }

  disable() {
    this.disabled = true;
    if (this.myEarningsService.account_number && this.myEarningsService.confirm_account_number && this.myEarningsService.ifsc_code &&
      this.myEarningsService.accountent_name && this.myEarningsService.authorize_bank_details == true) {
      this.disabled = false;
    }
    return this.disabled;
  }

}
