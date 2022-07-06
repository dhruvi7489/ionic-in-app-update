import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { OnboardingService } from 'src/app/onboarding/onboarding.service';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-upload-work-photo-view',
  templateUrl: './upload-work-photo-view.page.html',
  styleUrls: ['./upload-work-photo-view.page.scss'],
})
export class UploadWorkPhotoViewPage implements OnInit {

  constructor(
    public onboardingService: OnboardingService,
    public activeJobService: ActiveJobService,
  ) { }

  ngOnInit() {
  }

  addDescription(event) {
    this.onboardingService.description = event.ngModelData;
    this.onboardingService.leftCharacters = this.onboardingService.maxlengthDescription - this.onboardingService.description.length;
  }

  async retake() {
    await this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  async usePhoto() {
    await this.activeJobService.uploadAttendancePicture(this.activeJobService.blobData, this.activeJobService.enumType,true);
  }
}
