import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from 'src/app/onboarding/onboarding.service';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.page.html',
  styleUrls: ['./edit-payment.page.scss'],
})
export class EditPaymentPage implements OnInit {

  constructor(
    public onboardingService: OnboardingService,
    public router: Router,
    public activeJobService: ActiveJobService
  ) { }

  ngOnInit() {
  }

  addDescription(event) {
    this.onboardingService.description = event.ngModelData;
    this.onboardingService.leftCharacters = this.onboardingService.maxlengthDescription - this.onboardingService.description.length;
  }

  submitUpdatedAmount(event) {
    this.router.navigateByUrl('tabs/active-job');
  }
}
