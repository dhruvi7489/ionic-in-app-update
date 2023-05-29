import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-mark-attendance',
  templateUrl: './active-job-mark-attendance.page.html',
  styleUrls: ['./active-job-mark-attendance.page.scss'],
})
export class ActiveJobMarkAttendancePage implements OnInit {
  isWeb: boolean = false;

  constructor(
    public activeJobService: ActiveJobService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (Capacitor.getPlatform() == 'web') {
      this.isWeb = true;
    }
    if (!this.activeJobService.activeJob?.job) {
      this.router.navigateByUrl('tabs/active-job')
    }
  }

  async checkIn() {
    await this.activeJobService.markAttendance();
  }

  async uploadWorkPicture() {
    await this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  async uploadMoreWorkPictures() {
    await this.activeJobService.uploadProfilePicture("MIDDLE");
  }

  downloadApp() {
    window.open('https://play.google.com/store/apps/details?id=com.hour4u.app', "_blank")
  }
}
