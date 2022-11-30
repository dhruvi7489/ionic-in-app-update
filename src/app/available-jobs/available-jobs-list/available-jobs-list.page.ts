import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobUtilervice } from 'src/app/core/util/job-util.service';
import { AvailableJobsService } from '../available-jobs.service';

@Component({
  selector: 'app-available-jobs-list',
  templateUrl: './available-jobs-list.page.html',
  styleUrls: ['./available-jobs-list.page.scss'],
})
export class AvailableJobsListPage implements OnInit {
  timeout: any = null;
  constructor(
    public router: Router,
    public availableJobsService: AvailableJobsService,
    public jobUtilService: JobUtilervice
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.availableJobsService.jobLists = [];
    this.availableJobsService.page = 0;
    this.availableJobsService.getAllJobsList();
  }

  async searchAvailableJobs(event) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.availableJobsService.getAllJobsList(event);
      }
    }, 500);
  }

  counter(i) {
    return new Array(i);
  }

  goToJobDetails(selectedJob) {
    this.availableJobsService.selectedJobId = selectedJob.employmentId;
    this.router.navigateByUrl("available-job-details/" + this.availableJobsService.selectedJobId)
  }

  async doRefresh(event) {
    this.availableJobsService.jobLists = [];
    this.availableJobsService.page = 0;
    await this.availableJobsService.getAllJobsList();
    await event.target.complete();
  }

  async doInfinite(infiniteScroll) {
    if (this.availableJobsService.loadedMyAvailablesRecords != this.availableJobsService.totalAvailableRecords) {
      this.availableJobsService.page += 1;
      // this.availableJobsService.pageSize += 10;
      await this.availableJobsService.getAllJobsList();
      await setTimeout(() => {
        infiniteScroll.target.complete();
      }, 500)
    } else {
      await setTimeout(() => {
        infiniteScroll.target.complete();
      }, 500)
    }
  }

}
