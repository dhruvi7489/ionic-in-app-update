import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ExperiencesListPage } from '../profile/experiences-list/experiences-list.page';
import { MyEarningsService } from './my-earnings.service';
import { PaymentPage } from './payment/payment.page';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.page.html',
  styleUrls: ['./my-earnings.page.scss'],
})
export class MyEarningsPage implements OnInit {
  items = [];

  constructor(
    public router: Router,
    public myEarningsService: MyEarningsService,
    public modalCtrl: ModalController
  ) {
  }

  async ionViewWillEnter() {
    this.myEarningsService.selectedTab = 'Unapproved';
    await this.myEarningsService.getPaymentStatus();
    await this.myEarningsService.resetPayload();
    await this.myEarningsService.fetchUserWallet();
    if (this.myEarningsService.selectedTab == 'Paid') {
      await this.myEarningsService.fetchUserPayouts(false);
    } else {
      await this.myEarningsService.fetchUserPayouts(true);
      await this.myEarningsService.getPaymentRecords();
    }
  }

  ngOnInit(): void {

  }

  async withdrawAmount() {
    const modal = await this.modalCtrl.create({
      component: PaymentPage,
      componentProps: null
    })
    await modal.present();
  }

  async handleTabChange(event) {
    await document.getElementById(event.target.value).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    await this.myEarningsService.resetPayload();
    if (event.target.value == 'Paid') {
      await this.myEarningsService.fetchUserPayouts(false);
    } else {
      await this.myEarningsService.getPaymentRecords();
    }
  }

  async doInfinite(infiniteScroll) {
    if (this.myEarningsService.loadedMyEarningsRecords != this.myEarningsService.totalEarningRecords) {
      this.myEarningsService.page += 1;
      // this.myEarningsService.pageSize += 10;
      if (this.myEarningsService.selectedTab != 'Paid') {
        await this.myEarningsService.getPaymentRecords();
      } else {
        await this.myEarningsService.fetchUserPayouts(false);
      }
      await setTimeout(() => {
        infiniteScroll.target.complete();
      }, 500)
    } else {
      await setTimeout(() => {
        infiniteScroll.target.complete();
      }, 500)
    }
  }

  async doRefresh(event) {
    this.myEarningsService.earningRecords = [];
    this.myEarningsService.page = 0;
    await this.myEarningsService.getPaymentStatus();
    await this.myEarningsService.resetPayload();
    await this.myEarningsService.fetchUserWallet();
    if (this.myEarningsService.selectedTab == 'Paid') {
      await this.myEarningsService.fetchUserPayouts(false);
    } else {
      await this.myEarningsService.fetchUserPayouts(true);
      await this.myEarningsService.getPaymentRecords();
    }
    await event.target.complete();
  }
}
