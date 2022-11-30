import { Component, OnInit } from '@angular/core';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-job-rating',
  templateUrl: './job-rating.page.html',
  styleUrls: ['./job-rating.page.scss'],
})
export class JobRatingPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService
  ) { }

  ngOnInit() {
  }

  addJobRatingDescription(event) {
    this.activeJobService.jobRatingDescription = event.ngModelData;
    this.activeJobService.leftCharactersForjobRatingDescription = this.activeJobService.maxlengthjobRatingDescription - this.activeJobService.jobRatingDescription.length;
  }

  submitFeedback() {
    this.activeJobService.submitActiveJobRatingPayment();
  }

  removeRate() {
    this.activeJobService.selectedJobRating = 0;
  }

  addRate(rate) {
    this.activeJobService.selectedJobRating = rate;
  }
}
