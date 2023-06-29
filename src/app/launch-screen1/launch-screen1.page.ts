import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../onboarding/onboarding.service';
import { Capacitor } from '@capacitor/core';
import { Apiurl } from '../core/route';
import { CommonProvider } from '../core/common';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-launch-screen1',
  templateUrl: './launch-screen1.page.html',
  styleUrls: ['./launch-screen1.page.scss'],
})
export class LaunchScreen1Page implements OnInit {
  isWeb: boolean = false;

  constructor(
    public onboardingService: OnboardingService,
    public commonProvider: CommonProvider,
    public router: Router,
    public storage: Storage
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    if (Capacitor.getPlatform() == 'web') {
      this.isWeb = true;
    } else {
      this.isWeb = false;
    }
    console.log(this.router.url)
    if (this.router.url.includes('supervisor-admin/champs')) {
      this.checkForReferral();
    }
  }

  // Check for referral is correct or not
  checkForReferral() {
    console.log(this.router.url.split('champs/'))
    this.commonProvider.GetMethod(Apiurl.CheckReferralCode + this.router.url.split('champs/')[1], null).then(async (res: any) => {
      if (res && res?.id) {
        const lanchScreensVisited = await this.storage.get('lanchScreensVisited');
        if (!lanchScreensVisited) {
          this.router.navigateByUrl('launch-screen');
        } else {
          this.router.navigateByUrl('onboarding/onboarding-phone-number');
        }
        this.onboardingService.referralId = res?.id;
      }
    }).catch(err => {
      this.router.navigateByUrl('page-not-found');
    })
  }
}
