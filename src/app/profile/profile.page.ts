import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    public profileService: ProfileService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.profileService.getProfileData();
  }
}
