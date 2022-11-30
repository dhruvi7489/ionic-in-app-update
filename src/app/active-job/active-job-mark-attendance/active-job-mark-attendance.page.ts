import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-mark-attendance',
  templateUrl: './active-job-mark-attendance.page.html',
  styleUrls: ['./active-job-mark-attendance.page.scss'],
})
export class ActiveJobMarkAttendancePage implements OnInit {

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

  checkIn() {
    this.activeJobService.markAttendance();
  }

  uploadWorkPicture() {
    this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  uploadMoreWorkPictures() {
    this.activeJobService.uploadProfilePicture("MIDDLE");
  }

}
