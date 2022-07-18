import { Component, OnInit } from '@angular/core';
import { AvailableJobsService } from '../available-jobs/available-jobs.service';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.page.html',
  styleUrls: ['./my-jobs.page.scss'],
})
export class MyJobsPage implements OnInit {
  selectedTab: string = 'all';
  
  constructor(
    public availableJobsService: AvailableJobsService
  ) { }

  ngOnInit() {
  }

  searchMyJobs(event) {

  }
}
