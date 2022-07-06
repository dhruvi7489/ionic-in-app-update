import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-available-jobs',
  templateUrl: './available-jobs.page.html',
  styleUrls: ['./available-jobs.page.scss'],
})
export class AvailableJobsPage implements OnInit {

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
  }

}
