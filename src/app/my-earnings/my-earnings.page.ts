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
    await this.myEarningsService.getPaymentStatus();
    await this.myEarningsService.resetPayload();
    await this.myEarningsService.getPaymentRecords();
    await this.myEarningsService.fetchUserWallet();
    await this.myEarningsService.fetchUserPayouts(false);
    // this.myEarningsService.getAllPaymentRecords();
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
    this.myEarningsService.resetPayload();
    if (event.target.value == 'Paid') {
      this.myEarningsService.fetchUserPayouts(true);
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
        await this.myEarningsService.fetchUserPayouts(true);
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
}
