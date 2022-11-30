import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.page.html',
  styleUrls: ['./profile-header.page.scss'],
})
export class ProfileHeaderPage implements OnInit {


  @Input() headerTitle?: string = "";
  @Input() showBackBtn?: boolean = false;
  @Input() showContactIcon?: boolean = false;
  @Input() isModal?: boolean = false;

  search: string = "";

  @Output() searchData = new EventEmitter();

  constructor(
    public location: Location,
    public profileService: ProfileService,
    public router: Router,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  searchKeyUp(event) {
    this.search = event.ngModelData;
    this.searchData.emit(this.search);
  }

  back() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    } else {
      this.location.back();
    }
  }

  goToNotification() {
    this.router.navigateByUrl('notifications');
  }

  uploadPicture() {
    this.profileService.uploadProfilePicture();
  }
}
