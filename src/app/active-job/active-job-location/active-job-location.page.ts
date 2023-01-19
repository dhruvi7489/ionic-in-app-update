import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-location',
  templateUrl: './active-job-location.page.html',
  styleUrls: ['./active-job-location.page.scss'],
})
export class ActiveJobLocationPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService,
    public locationService: LocationService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.activeJobService.activeJob?.job) {
      this.router.navigateByUrl('tabs/active-job')
    }
  }

  //enable location
  enableLocation() {
    this.activeJobService.checkLocationEnable();
  }

  navigateLocation() {
    this.activeJobService.navigateToMap();
  }

}
