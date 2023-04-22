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
  async enableLocation() {
    await this.activeJobService.checkLocationEnable();
  }

  async navigateLocation() {
    await this.activeJobService.navigateToMap();
  }

}
