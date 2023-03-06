import { Component, OnInit } from '@angular/core';
import { MyEarningsService } from '../my-earnings.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {

  constructor(public myEarningsService: MyEarningsService) { }

  ngOnInit() {
  }

  getAvailableAmount(event) {
    this.myEarningsService.availableAmountForWithdraw = event.ngModelData;
  }

  getWantToWithdrawAmount(event) {
    this.myEarningsService.wantAmountForWithdraw = event.ngModelData;
  }

  disable() {
    if (!this.myEarningsService.wantAmountForWithdraw || this.myEarningsService.wantAmountForWithdraw > this.myEarningsService.availableAmountForWithdraw || this.myEarningsService.wantAmountForWithdraw <= 0) {
      return true;
    } else {
      return false;
    }
  }

  withdrawAmount() {
    this.myEarningsService.withdrawAmount();
  }
}
