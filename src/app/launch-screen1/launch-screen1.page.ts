import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../onboarding/onboarding.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-launch-screen1',
  templateUrl: './launch-screen1.page.html',
  styleUrls: ['./launch-screen1.page.scss'],
})
export class LaunchScreen1Page implements OnInit {
  isWeb: boolean = false;

  constructor(
    public onboardingService: OnboardingService
  ) { }

  ngOnInit() {
    console.log("Capacitor.getPlatform()", Capacitor.getPlatform())
    if (Capacitor.getPlatform() == 'web') {
      this.isWeb = true;
    } else {
      this.isWeb = false;
    }
  }

}
