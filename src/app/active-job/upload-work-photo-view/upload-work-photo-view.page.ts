import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-upload-work-photo-view',
  templateUrl: './upload-work-photo-view.page.html',
  styleUrls: ['./upload-work-photo-view.page.scss'],
})
export class UploadWorkPhotoViewPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.activeJobService.workPictureDescription = null;
  }
  
  addDescription(event) {
    this.activeJobService.workPictureDescription = event.ngModelData;
    this.activeJobService.leftworkPictureDescriptionCharacters = this.activeJobService.maxlengthworkPictureDescription - this.activeJobService.workPictureDescription.length;
  }

  async retake() {
    await this.activeJobService.pickImage(CameraSource.Camera, "MIDDLE");
  }

  async usePhoto() {
    await this.activeJobService.uploadAttendancePicture(this.activeJobService.blobData, this.activeJobService.enumType, true);
  }
}
