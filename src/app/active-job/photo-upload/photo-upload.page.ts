import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.page.html',
  styleUrls: ['./photo-upload.page.scss'],
})
export class PhotoUploadPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService,
    public navParams: NavParams
  ) { }

  ngOnInit() {
  }

  uploadPicture() {
    this.activeJobService.openLoginSelfiePictureUploadOptions();
  }

  saveAttandanceImage() {
    this.activeJobService.saveImage('START');
  }
}
