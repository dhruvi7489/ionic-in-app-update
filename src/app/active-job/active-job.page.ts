import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { AvailableJobsService } from '../available-jobs/available-jobs.service';
import { LocationService } from '../services/location.service';
import { ActiveJobService } from './active-job.service';

@Component({
  selector: 'app-active-job',
  templateUrl: './active-job.page.html',
  styleUrls: ['./active-job.page.scss'],
})
export class ActiveJobPage implements OnInit {
  constructor(
    public router: Router,
    public activeJobService: ActiveJobService,
    public locationService: LocationService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getActiveJob();
  }

  async getActiveJob() {
    await this.activeJobService.GetActiveJob();
    setInterval(async () => {
      if (this.activeJobService.activeJob == null && !this.activeJobService.jobCompleted) {
        await this.activeJobService.GetActiveJob();
      }
    }, 5000)
    if (this.activeJobService.activeJob?.attendanceLocationTrackerRequired) {

    }
  }

  async applyForJob() {
    this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
  }

  enableLocation() {

  }

  navigateLocation() {

  }

  checkIn() {
    this.activeJobService.markAttendance();
  }

  uploadWorkPicture() {
    this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  uploadWorkPictures() {
    this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  uploadMoreWorkPictures() {
    this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  async checkOut() {
    // await this.activeJobService.updateHistory();
    await this.activeJobService.checkOut();
  }

  ionViewWillLeave() {
    clearInterval();
  }
}
