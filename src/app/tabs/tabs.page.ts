import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { OnboardingService } from '../onboarding/onboarding.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  initial: string = null;

  constructor(
    public router: Router,
    public storage: Storage,
    public onboardingService: OnboardingService
  ) {
    this.setInitialValues();
  }

  async setInitialValues() {
    const loginUserInitial = await this.storage.get('loginUserInitial');
    this.initial = loginUserInitial;
  }

  setCurrentTab(event) {
    console.log(event.tab)
    this.onboardingService.activeTab = event.tab;
  }

  goToRoute(route) {
    console.log("+++++++++", route)
    this.router.navigateByUrl(route)
  }
}
