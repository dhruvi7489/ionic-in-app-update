import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { OnboardingService } from '../onboarding.service';
// declare var MediaRecorder: any;

import { CommonProvider } from 'src/app/core/common';
import { Storage } from '@ionic/storage';
// import { Base64 } from '@ionic-native/base64';

@Component({
  selector: 'app-onboarding-phone-number',
  templateUrl: './onboarding-phone-number.page.html',
  styleUrls: ['./onboarding-phone-number.page.scss'],
})
export class OnboardingPhoneNumberPage implements OnInit {
  data = null;
  loginUserId: any = null;

  constructor(
    private toastService: ToastService,
    public onboardingService: OnboardingService,
    public router: Router,
    public storage: Storage
  ) {

  }

  async ngOnInit() {
    this.loginUserId = await this.storage.get('loginUserId');
    if (this.loginUserId) {
      return;
    }
  }

  async ionViewWillEnter() {
    this.data = "All API calls mentioned in this guide must be authenticated with an access token. Developers can authenticate their API calls with the access token generated in the App Dashboard >"
  }

  onKeyUp(event) {
    this.onboardingService.mobile = event.ngModelData;
  }

  async openOTPPage() {
    // window.open('https://wa.me/7048450515', "_blank");
    // window.open('https://api.whatsapp.com/send?phone=91' + this.onboardingService.mobile + '&amp;' + 'text=' + this.data, "_blank");
    const phoneno = /^\d{10}$/;
    if (!this.onboardingService.mobile.match(phoneno)) {
      this.toastService.showMessage('Please enter a valid mobile number');
      return false;
    } else {
      this.onboardingService.sendOtp().then(res => {
      }).catch(err => {

      });
    }
  }
}
