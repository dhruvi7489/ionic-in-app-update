import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyEarningsService } from './my-earnings.service';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.page.html',
  styleUrls: ['./my-earnings.page.scss'],
})
export class MyEarningsPage implements OnInit {

  constructor(
    public router: Router,
    public myEarningsService: MyEarningsService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.myEarningsService.getPaymentStatus();
    await this.myEarningsService.getPaymentRecords();
  }

  withdrawAmount() {
    this.router.navigateByUrl('payment')
  }

  handleTabChange() {
    this.myEarningsService.tabChangeHandle();
  }

}
