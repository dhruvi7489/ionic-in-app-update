import { Component, OnInit } from '@angular/core';
import { OnboardingService } from './onboarding.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(
    public onboardingService: OnboardingService,
  ) { }

  ngOnInit() {
  }
}
