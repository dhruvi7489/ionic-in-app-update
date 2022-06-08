import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-phone-number',
  templateUrl: './onboarding-phone-number.page.html',
  styleUrls: ['./onboarding-phone-number.page.scss'],
})
export class OnboardingPhoneNumberPage implements OnInit {
  @Output() openOnboardingOtpPage = new EventEmitter();

  constructor(
    private toastService: ToastService,
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onKeyUp(event) {
    this.onboardingService.phone_no = event.ngModelData;
  }

  openOTPPage() {
    const phoneno = /^\d{10}$/;
    if (!this.onboardingService.phone_no.match(phoneno)) {
      this.toastService.showMessage('Please enter a valid mobile number');
      return false;
    } else {
      this.router.navigateByUrl('onboarding-otp');
      this.onboardingService.sendOtp().then(res => {
        console.log(res)
      }).catch(err => {

      });
      this.openOnboardingOtpPage.emit(this.onboardingService.phone_no);
    }
  }
}
