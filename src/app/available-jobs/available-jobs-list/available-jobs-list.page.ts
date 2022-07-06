import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableJobsService } from '../available-jobs.service';

@Component({
  selector: 'app-available-jobs-list',
  templateUrl: './available-jobs-list.page.html',
  styleUrls: ['./available-jobs-list.page.scss'],
})
export class AvailableJobsListPage implements OnInit {

  constructor(
    public router: Router,
    public availableJobsService: AvailableJobsService
  ) { }

  ngOnInit() {
    this.availableJobsService.getAllJobsList();
  }

  async searchAvailableJobs(event) {
    console.log(event)
    if (event.length == 0 || event.length > 2) {
      await this.availableJobsService.getAllJobsList(event);
    }
  }

  counter(i) {
    return new Array(i);
  }

  goToJobDetails(selectedJob) {
    this.availableJobsService.selectedJobId = selectedJob.employmentId;
    this.router.navigateByUrl("available-job-details")
  }

  async doRefresh(event) {
    this.availableJobsService.jobLists = [];
    await this.availableJobsService.getAllJobsList();
    await event.target.complete();
  }

}
