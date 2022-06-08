import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-profile-picture',
  templateUrl: './onboarding-profile-picture.page.html',
  styleUrls: ['./onboarding-profile-picture.page.scss'],
})
export class OnboardingProfilePicturePage implements OnInit {

  @Output() skipProfilePictureUploadPage = new EventEmitter();
  @Output() openJobTypePage = new EventEmitter();

  constructor(
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  uploadPicture() {
    this.onboardingService.uploadProfilePicture();
  }

  skipProfilePictureUpload() {
    this.skipProfilePictureUploadPage.emit();
    this.router.navigateByUrl('onboarding-job-type');
  }

  openJobType() {
    this.openJobTypePage.emit();
    this.router.navigateByUrl('onboarding-job-type');
  }

  fileChange(event) {
    this.onboardingService.profile_picture = event.ngModelData
    this.onboardingService.uploadProfilePicture();
  }
}
