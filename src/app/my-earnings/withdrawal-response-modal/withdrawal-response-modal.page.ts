import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { MyEarningsService } from '../my-earnings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-withdrawal-response-modal',
  templateUrl: './withdrawal-response-modal.page.html',
  styleUrls: ['./withdrawal-response-modal.page.scss'],
})
export class WithdrawalResponseModalPage implements OnInit {

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public myEarningsService: MyEarningsService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async okBtnClick() {
    if (this.navParams.get('okBtnText') == "Try again") {
      // await this.modalCtrl.dismiss(true);
      await this.myEarningsService.withdrawAmount();
    } else {
      // await this.modalCtrl.dismiss(true);
      await this.myEarningsService.goToContact();
      await this.router.navigateByUrl("tabs/my-earnings")
    }
  }

  async closeBtnClick() {
    await this.modalCtrl.dismiss(true);
    await this.router.navigateByUrl("tabs/my-earnings")
  }
}
