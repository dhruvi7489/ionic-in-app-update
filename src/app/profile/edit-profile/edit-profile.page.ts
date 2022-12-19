import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Address } from 'src/app/core/modal/address.modal';
import { ToastService } from 'src/app/services/toast.service';
import { ProfileService } from '../profile.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  disabled: boolean = false;

  @ViewChild('search', { static: false }) public searchElementRef: ElementRef;

  constructor(
    public profileService: ProfileService,
    private ngZone: NgZone,
    public toastService: ToastService
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.profileService.profileData) {
      this.profileService.autocompleteItems = [];
      this.profileService.autocomplete = {
        query: ''
      };
      this.profileService.getProfileData();
    }
  }
  disable() {
    this.disabled = true;
    if (this.profileService.full_name && this.profileService.email_address && this.profileService.gender && this.profileService.phone_no
      && this.profileService.dob) {
      this.disabled = false;
    }
    return this.disabled;
  }

  getFullName(event) {
    this.profileService.full_name = event.ngModelData;
  }

  getEmailAddress(event) {
    this.profileService.email_address = event.ngModelData;
    this.disable();
  }

  getDOB(event) {
    this.profileService.dob = event.ngModelData;
    this.disable();
  }

  getPhoneNumber(event) {
    this.profileService.phone_no = event.ngModelData;
    this.disable();
  }

  getGender(event) {
    this.profileService.gender = event.ngModelData;
    this.disable();
  }

  getLocation(event) {
    this.profileService.location = event.ngModelData;
    this.disable();
  }

  getVehicleAvailibility(event) {
    this.profileService.vehicleAvailability = event.ngModelData;
    this.disable();
  }

  getVehicleCertificateId(event) {
    this.profileService.vaccineCertID = event.ngModelData;
    this.disable();
  }

  updateProfile() {
    this.profileService.updateProfile();
  }

  uploadPicture() {
    this.profileService.uploadProfilePicture();
  }

  updateSearch(event) {
    this.profileService.location = event.ngModelData;
    this.profileService.autocomplete.query = event.ngModelData;
    this.disable();
    if (this.profileService.autocomplete.query == '') {
      this.profileService.autocompleteItems = [];
      return;
    }

    const me = this;
    this.profileService.service.getPlacePredictions({
      input: this.profileService.autocomplete.query,

    }, (predictions, status) => {
      me.profileService.autocompleteItems = [];
      me.ngZone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.profileService.autocompleteItems.push(prediction.description);
          });
          // this.profileService.autocomplete.query= predictions[0].description;
        }
      });
    });
  }

  chooseItem(item: any) {
    this.profileService.location = item;
    this.profileService.autocomplete.query = item;
    this.profileService.autocompleteItems = [];
    this.profileService.geo = item;
    this.profileService.autocompleteItems = [];
    this.profileService.geoCode(this.profileService.geo); // convert Address to lat and long
  }



}
