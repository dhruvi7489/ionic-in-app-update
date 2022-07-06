import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { AvailableJobsService } from '../available-jobs.service';

@Component({
  selector: 'app-job-application-modal',
  templateUrl: './job-application-modal.page.html',
  styleUrls: ['./job-application-modal.page.scss'],
})
export class JobApplicationModalPage implements OnInit {

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public availableJobsService: AvailableJobsService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async okBtnClick() {
    if (this.navParams.get('okBtnText') == "Try again") {
      await this.availableJobsService.submitJobApplication(this.navParams.get('hourlyRate'), this.navParams.get('isApplyLater'))
      await this.modalCtrl.dismiss();
      await this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
    } else {
      await this.modalCtrl.dismiss();
      await this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
    }
  }

  async closeBtnClick() {
    await this.modalCtrl.dismiss();
    await this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
  }
}
