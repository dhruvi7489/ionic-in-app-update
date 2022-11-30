import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AvailableJobsService } from '../available-jobs/available-jobs.service';
import { JobUtilervice } from '../core/util/job-util.service';
import { MyJobsService } from './my-jobs.service';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.page.html',
  styleUrls: ['./my-jobs.page.scss'],
})
export class MyJobsPage implements OnInit {

  constructor(
    public myJobsService: MyJobsService,
    public availableJobsService: AvailableJobsService,
    public router: Router,
    public jobUtilService: JobUtilervice
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.myJobsService.resetPayload();
    this.myJobsService.getMyJobs();
  }

  goToJobDetails(selectedJob) {
    this.availableJobsService.selectedJobId = selectedJob.employmentId;
    this.router.navigateByUrl("available-job-details/" + this.availableJobsService.selectedJobId)
  }

  findJobs() {
    this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
  }

  async handleTabChange(event) {
    if (event.target.value) {
      await document.getElementById(event.target.value).scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
    await this.myJobsService.resetPayload();
    await this.myJobsService.getMyJobs();
  }

  async doInfinite(infiniteScroll) {
    if (this.myJobsService.loadedMyJobsRecords != this.myJobsService.totalMyJobsRecords) {
      this.myJobsService.page += 1;
      // this.myJobsService.pageSize += 10;
      await this.myJobsService.getMyJobs();
      await setTimeout(() => {
        infiniteScroll.target.complete();
      }, 500)
    } else {
      await setTimeout(() => {
        infiniteScroll.target.complete();
      }, 500)
    }
  }

  async doRefresh(event) {
    this.myJobsService.myJobsList = [];
    this.myJobsService.page = 0;
    await this.myJobsService.getMyJobs();
    await event.target.complete();
  }
}
