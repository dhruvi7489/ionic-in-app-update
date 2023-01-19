import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraSource } from '@capacitor/camera';
import { AvailableJobsService } from '../available-jobs/available-jobs.service';
import { LocationService } from '../core/services/location.service';
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
    this.activeJobService.GetActiveJob();
  }
}
