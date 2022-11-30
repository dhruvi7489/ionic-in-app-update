import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-end',
  templateUrl: './active-job-end.page.html',
  styleUrls: ['./active-job-end.page.scss'],
})
export class ActiveJobEndPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.activeJobService.activeJob?.job) {
      this.router.navigateByUrl('tabs/active-job')
    }
  }

  async checkOut() {
    await this.activeJobService.checkOut();
  }

  async uploadMoreWorkPictures() {
    this.activeJobService.uploadProfilePicture("MIDDLE");
  }
}
