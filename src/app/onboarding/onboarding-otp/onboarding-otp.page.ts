import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-otp',
  templateUrl: './onboarding-otp.page.html',
  styleUrls: ['./onboarding-otp.page.scss'],
})
export class OnboardingOtpPage implements OnInit {

  @Input() mobile = null;

  constructor(
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.onboardingService.otp = null;
    this.onboardingService.otp_input_1 = null;
    this.onboardingService.otp_input_2 = null;
    this.onboardingService.otp_input_3 = null;
    this.onboardingService.otp_input_4 = null;
    this.onboardingService.otp_input_5 = null;
    this.onboardingService.otp_input_6 = null;
  }

  otpEnter(otp) {
    console.log("++++++++++", otp)
    this.onboardingService.otp = otp;
    let otpArray = otp.split("");
    this.onboardingService.otp_input_1 = otpArray[0];
    this.onboardingService.otp_input_2 = otpArray[1];
    this.onboardingService.otp_input_3 = otpArray[2];
    this.onboardingService.otp_input_4 = otpArray[3];
    this.onboardingService.otp_input_5 = otpArray[4];
    this.onboardingService.otp_input_6 = otpArray[5];

  }

  async sendOtp() {
    await this.onboardingService.login();
  }

  onOtpChange(event) {
    this.onboardingService.otp = event;
  }
}
