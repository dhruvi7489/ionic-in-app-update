import { Component, OnInit } from '@angular/core';
import { ProfileService, UploadPhotos } from '../profile.service';

@Component({
  selector: 'app-photos-videos',
  templateUrl: './photos-videos.page.html',
  styleUrls: ['./photos-videos.page.scss'],
})
export class PhotosVideosPage implements OnInit {
  constructor(
    public profileService: ProfileService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  uploadPictures() {
    this.profileService.uploadProfilePicture(0);
  }

  // delete index wise photo
  deletePhotos(i) {
    this.profileService.photos.splice(i, 1);
    this.profileService.updatePhotos('delete');
  }
}
