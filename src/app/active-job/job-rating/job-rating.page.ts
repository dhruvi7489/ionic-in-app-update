import { Component, OnInit } from '@angular/core';
import { OnboardingService } from 'src/app/onboarding/onboarding.service';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-job-rating',
  templateUrl: './job-rating.page.html',
  styleUrls: ['./job-rating.page.scss'],
})
export class JobRatingPage implements OnInit {

  constructor(
    public onboardingService: OnboardingService,
    public activeJobService: ActiveJobService
  ) { }

  ngOnInit() {
  }

  addDescription(event) {
    this.onboardingService.description = event.ngModelData;
    this.onboardingService.leftCharacters = this.onboardingService.maxlengthDescription - this.onboardingService.description.length;
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
