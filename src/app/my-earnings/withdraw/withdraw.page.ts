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

  getAvilableAmount(event) {
    this.myEarningsService.availableAmountForWithdraw = event.ngModelData;
  }

  getWantToWithdrawAmount(event) {
    this.myEarningsService.wantAmountForWithdraw = event.ngModelData;
  }

  disable() {
    if (!this.myEarningsService.wantAmountForWithdraw) {
      return true;
    } else {
      return false;
    }
  }

  withdrawAmount() {

  }
}
