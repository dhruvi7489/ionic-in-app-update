import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { CommonProvider } from '../core/common';
import { Address } from '../core/modal/address.modal';
import { WorkExperience } from '../core/modal/experience.modal.ts';
import { JobPreference } from '../core/modal/job-preference.modal';
import { S3Object } from '../core/modal/s3-object.modal';
import { Apiurl } from '../core/route';
import { S3Util } from '../core/util/s3.util';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { ExperiencesListPage } from './experiences-list/experiences-list.page';
import { Storage } from '@ionic/storage';
import { OnboardingService } from '../onboarding/onboarding.service';
declare var google;

export class UploadPhotos {
  imageSrc: string;
  blobInfo: any;
  isUploading = false;
  s3Object: S3Object;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  photos: any[];
  loginUserName: string = '';
  loginUserAddress: string = '';
  initialOfName: string = '';

  full_name: string = null;
  email_address: string = null;
  dob: any = moment(new Date()).format("YYYY-MM-DD");
  phone_no: string = null;
  gender: any;
  location: string = null;
  vehicleAvailability: any;
  vaccineCertID: string = null;

  service = new google.maps.places.AutocompleteService();
  // autocomplete;
  autocompleteItems;
  latitude = 0;
  longitude = 0;
  geo: any;
  addressObj: Address = new Address(40.730610, -73.935242);
  autocomplete: any = {
    query: ''
  };

  profile_picture: any = null;


  links: any[] = [];
  experienceDescription: string = null;
  maxlengthExperienceDescription = 200;
  link: string = null;
  leftCharactersExperienceDescription = 0;

  editWorkExperienceFlag: boolean = false;

  profileData = null;
  jobPreferences: JobPreference;

  constructor(
    public commonProvider: CommonProvider,
    public toastService: ToastService,
    public actionSheetController: ActionSheetController,
    public sanitizer: DomSanitizer,
    public zone: NgZone,
    public router: Router,
    public modalCtrl: ModalController,
    public loadingService: LoadingService,
    public storage: Storage,
    public onboardingService: OnboardingService
  ) {
    this.setInitialValues();
  }

  // Assign storage data to variable
  async setInitialValues() {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    const loginUserInitial = await this.storage.get('loginUserInitial');

    this.loginUserName = JSON.parse(loginUserInfo)?.name;
    this.loginUserAddress = JSON.parse(loginUserInfo)?.address?.address;
    this.initialOfName = loginUserInitial;
  }

  // Get Profile data  
  async getProfileData(i?) {
    this.loadingService.show();
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    return await this.commonProvider.GetMethod(Apiurl.GetPersonalInfo + loginUserMobileNo, null).then(async (res: any) => {
      if (res) {
        this.loadingService.dismiss();
        this.profileData = res;
        this.full_name = this.profileData.name;
        this.email_address = this.profileData.email;
        this.dob = moment(new Date(this.profileData?.dob)).format("YYYY-MM-DD");
        this.phone_no = this.profileData.mobile;
        this.gender = this.profileData.gender;
        this.location = this.profileData.address?.address;
        this.autocomplete.query = this.profileData.address?.address;
        this.addressObj = this.profileData.address;
        this.photos = this.profileData.photos;

        if (this.profileData.vehicleAvailability) {
          this.vehicleAvailability = 'Yes';
        } else {
          this.vehicleAvailability = 'No';
        }
        this.vaccineCertID = this.profileData.vaccineCertID;
        this.storage.set('loginUserInfo', JSON.stringify(this.profileData));
        this.storage.set('loginUserId', this.profileData.id);
        this.storage.set('loginUserGender', this.gender);
        this.storage.set('loginUserInitial', this.getLoginUserNameInitial());

        // localStorage.setItem('loginUserInfo', JSON.stringify(this.profileData));
        // localStorage.setItem('loginUserId', this.profileData.id);
        // localStorage.setItem('loginUserGender', this.gender);
        // localStorage.setItem('loginUserInitial', this.getLoginUserNameInitial());
        const loginUserInfo = await this.storage.get('loginUserInfo');
        this.loginUserName = JSON.parse(loginUserInfo)?.name;
        this.loginUserAddress = JSON.parse(loginUserInfo)?.address?.address;
        if (this.profileData?.workExperiences && this.profileData?.workExperiences?.length != 0) {
          if (i) {
            this.experienceDescription = this.profileData?.workExperiences[i]?.summary;
          } else {
            this.experienceDescription = this.profileData?.workExperiences[0]?.summary;
          }
          this.leftCharactersExperienceDescription = this.maxlengthExperienceDescription - (this.experienceDescription?.length ? this.experienceDescription?.length : 0);
          if (this.profileData?.workExperiences[0]?.workLink?.length == 0) {
            this.links = [];
            this.addLinks('', 0)
          } else {
            this.links = [];
            if (i) {
              this.profileData?.workExperiences[i]?.workLink?.forEach((element, index) => {
                if (index < 3) {
                  this.addLinks(element, index)
                }
              });
            } else {
              this.profileData?.workExperiences[0]?.workLink?.forEach((element, index) => {
                if (index < 3) {
                  this.addLinks(element, index)
                }
              })
            }
          }
        }
        await this.setProfilePicture();
        await this.getJobPreference();
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err)
    })
  }

  // Get Login User Initials
  getLoginUserNameInitial() {
    let initialOfName = null;
    if (this.full_name.split(' ').length == 1) {
      initialOfName = this.full_name.split('')[0] + this.full_name.split('')[1]
    }
    if (this.full_name.split(' ').length > 1) {
      initialOfName = this.full_name.split(' ')[0].split('')[0] + this.full_name.split(' ')[1].split('')[0]
    }
    return initialOfName ? initialOfName : this.full_name.split('')[0];
  }

  // Save Profile Picture
  async setProfilePicture() {
    if (!this.profileData.profilePhoto) {
      this.profile_picture = '../../../../assets/imgs/';
      if (this.profileData.gender == 'Male') {
        this.profile_picture += 'camera_placeholder.svg';
      } else {
        this.profile_picture += 'camera_placeholder.svg';
      }
    } else {
      this.profile_picture = this.commonProvider.ImagePath + this.profileData?.profilePhoto + "?" + new Date().getTime();
    }
  }

  // Update login user personal Information
  async updateProfile() {
    console.log(this.addressObj)
    this.profileData.dob = new Date(this.dob);
    this.profileData.email = this.email_address;
    this.profileData.gender = this.gender;
    this.profileData.mobile = this.phone_no;
    this.profileData.name = this.full_name;
    this.profileData.address = this.addressObj;
    if (this.vehicleAvailability == 'Yes') {
      this.profileData.vehicleAvailability = true;
    } else {
      this.profileData.vehicleAvailability = false;
    }
    this.profileData.vaccineCertID = this.vaccineCertID;

    return await this.commonProvider.PutMethod(Apiurl.SavePersonalInfo + '/' + this.profileData.id, this.profileData).then(async (res: any) => {
      if (res) {
        this.toastService.showMessage("Personal information updated successfully");
        this.modalCtrl.dismiss();
        await this.getProfileData();
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  // Add experiences links
  addLinks(element, i) {
    let obj;
    if (this.links.length < 3) {
      obj = {
        imgPath: '../../assets/imgs/Iconsax/Svg/All/outline/add.svg',
        imgPath1: '',
        id: this.links.length,
        url: element
      }
      this.links.push(obj)
      if (this.links.length >= 2) {
        obj = {
          imgPath1: '../../assets/imgs/Iconsax/Svg/All/outline/minus.svg',
          imgPath: '',
          id: this.links[i].id,
          url: element
        }
        this.links[i] = obj
      }
    }
  }

  // Apply for selected job
  async getJobPreference() {
    const loginUserId = await this.storage.get('loginUserId');
    let params = '?page=0&size=1&sort=createdOn,desc&jobSeekerId=' + loginUserId;
    return await this.commonProvider.GetMethod(Apiurl.JobPreference + params, null).then(async (res: any) => {
      if (res) {
        this.jobPreferences = res.content[0];
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  // Upload profile picture options
  async uploadProfilePicture(index = -1) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(CameraSource.Camera, index);
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.pickImage(CameraSource.Photos, index);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // After selecting img from camera and gallery
  async pickImage(source: CameraSource, index) {
    const image = await Camera.getPhoto({
      quality: 80,
      height: 700,
      width: 700,
      source,
      correctOrientation: true,
      resultType: CameraResultType.DataUrl,
    });
    const blobData = this.b64toBlob(image.dataUrl.split('base64,')[1], `image/${image.format}`);
    if (index == -1) {
      this.saveProfilePicture(blobData, image.format);
    } else {
      this.saveProfilePictures(blobData);
    }
  }

  // convert Img to blob file
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  // Senitize Url
  cleanURL(oldURL): SafeUrl {
    return this.sanitizer.sanitize(SecurityContext.URL, oldURL)
  }

  // Generate random file name
  rendomFileName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  // Save profile picture
  async saveProfilePicture(blobData, format) {
    const loginUserId = await this.storage.get('loginUserId');
    let s3Object: S3Object = null;
    const formData = new FormData();
    let filename = "IMG-" + this.rendomFileName(5) + ".jpg";
    formData.append('id', loginUserId);
    formData.append('profile', blobData, filename);

    await this.commonProvider.PostMethod(Apiurl.UploadProfilePicture + loginUserId, formData).then(async (res: S3Object) => {
      if (res) {
        this.zone.run(() => {
          s3Object = res;
          this.profile_picture = S3Util.getFileUrl(res);
        })
        await this.commonProvider.PutMethod(Apiurl.UpdateProfilePicture + loginUserId, s3Object.key).then(async (res: any) => {
          if (res) {
            await this.getProfileData();
            this.toastService.showMessage("Profile picture saved successfully");
          }
        }).catch((err: HttpErrorResponse) => {
          console.log(err)
        })
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }


  // Save profile pictures
  async saveProfilePictures(blobData) {
    const loginUserId = await this.storage.get('loginUserId');
    const formData = new FormData();
    let filename = "IMG-" + this.rendomFileName(5) + ".jpg";
    formData.append('id', loginUserId);
    formData.append('photo', blobData, filename);

    await this.commonProvider.PostMethod(Apiurl.UploadProfilePictures + loginUserId, formData).then(async (res: S3Object) => {
      if (res) {
        this.photos.push(S3Util.getFileUrl(res));
        await this.updatePhotos();
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  async updatePhotos(flag = 'save') {
    const loginUserId = await this.storage.get('loginUserId');
    this.loadingService.show();
    await this.commonProvider.PutMethod(Apiurl.UpdateProfilePhotos + loginUserId, this.photos).then(async (res: any) => {
      this.loadingService.dismiss();
      if (res) {
        if (flag == 'save') {
          this.toastService.showMessage("Profile photos saved successfully");
        } else {
          this.toastService.showMessage("Profile photos deleted successfully");
        }
        await this.getProfileData();
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      if (flag == 'save') {
        this.toastService.showMessage("Profile photos not saved!");
      } else {
        this.toastService.showMessage("Profile photos not deleted!");

      }
      console.log(err)
    })
  }

  // Save login user Experience
  async UpdateWorkExperience(index) {
    console.log(index)
    if (this.editWorkExperienceFlag) {
      this.editExperience(index);
    } else {
      this.addExperience();
    }
  }

  // Edit Work Experience
  async editExperience(index) {
    const loginUserId = await this.storage.get('loginUserId');
    let workLink = [];
    let links = [];
    this.links.forEach(ele => {
      workLink.push(ele.url);
      links.push({ "url": ele.url })
    })
    if (this.experienceDescription) {
      let params = {
        "summary": this.experienceDescription,
        "workLink": workLink
      }
      await this.commonProvider.PutMethod(Apiurl.EditWorkExperience + loginUserId + '?updateIndex=' + index, params).then(async (res: any) => {
        if (res) {
          this.toastService.showMessage('Work Experience edited successfully')
          this.modalCtrl.dismiss();
          this.getProfileData();
          this.editWorkExperienceFlag = false;
          const modal = await this.modalCtrl.create({
            component: ExperiencesListPage,
            componentProps: null
          });
          await modal.present();
        } else {
          this.toastService.showMessage('Work Experience not edited')
        }
      }).catch((err: HttpErrorResponse) => {
        this.toastService.showMessage('Work Experience not edited, Something went wrong...')
        console.log(err)
      })
    }
  }

  // Add Work Experience
  async addExperience() {
    const loginUserId = await this.storage.get('loginUserId');
    let workLink = [];
    let links = [];
    this.links.forEach(ele => {
      workLink.push(ele.url);
      links.push({ "url": ele.url })
    })
    let params = {
      "summary": this.experienceDescription,
      "workLink": workLink
    }
    await this.commonProvider.PutMethod(Apiurl.SaveWorkExperience + loginUserId, params).then(async (res: any) => {
      if (res) {
        this.toastService.showMessage('Work Experience added successfully')
        this.modalCtrl.dismiss();
        this.getProfileData();
      } else {
        this.toastService.showMessage('Work Experience not added!')
      }
    }).catch((err: HttpErrorResponse) => {
      this.toastService.showMessage('Work Experience not deleted, Something went wrong...')
      console.log(err)
    })
  }

  // Delete Work Experience
  async deleteWorkExperience(index) {
    const loginUserId = await this.storage.get('loginUserId');
    await this.commonProvider.PutMethod(Apiurl.DeleteWorkExperience + loginUserId, index).then(async (res: any) => {
      if (res) {
        this.toastService.showMessage('Work Experience deleted successfully')
        this.modalCtrl.dismiss();
        this.getProfileData();
      } else {
        this.toastService.showMessage('Work Experience not deleted!')
      }
    }).catch((err: HttpErrorResponse) => {
      this.toastService.showMessage('Work Experience not deleted, Something went wrong...')
      console.log(err)
    })
  }
  // Get geocode from address
  geoCode(address: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      this.autocompleteItems = [];
      this.autocomplete.query = address;
      console.log(this.autocomplete.query, this.autocompleteItems);
      const latLng = new google.maps.LatLng(this.latitude, this.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 9,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      this.getAddress(this.latitude, this.longitude);
      console.log("lat: " + this.latitude + ", long: " + this.longitude);
    });
  }

  // Get city, country, zip from latitude, longitude
  getAddress(latitude, longitude) {
    this.addressObj.latitude = latitude;
    this.addressObj.longitude = longitude;
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.autocomplete.query = results[0].formatted_address;
          this.addressObj.address = results[0].formatted_address;
          this.addressObj.placeId = results[0].place_id;
          for (let i = 0; i < results[0].address_components.length; i++) {
            if (results[0].address_components[i].types[0] == 'locality') {
              this.addressObj.city = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] == 'administrative_area_level_1') {
              this.addressObj.region = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] == 'country') {
              this.addressObj.country = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] == 'postal_code') {
              this.addressObj.zip = results[0].address_components[i].long_name;
            }
          }
          // this.transmitData();
        } else {
          this.toastService.showMessage('No results found', 2000);
        }
      } else {
        this.toastService.showMessage('Google maps location failed due to: ' + status, 2000);
      }
    });
    console.log('addressObj:::', this.addressObj);
  }

  // Selecet option introduction video
  async selectIntoVideoUploadOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.pickVideo(CameraSource.Camera);
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.pickVideo(CameraSource.Photos);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async pickVideo(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 80,
      height: 700,
      width: 700,
      source,
      correctOrientation: true,
      resultType: CameraResultType.DataUrl,
    });
    const blobData = this.b64toBlob(image.dataUrl.split('base64,')[1], `video/${image.format}`);
    console.log(blobData)
  }

  // Add Introduction video
  uploadIntroductionVideo() {

  }

  // Delete Introduction video
  async deleteIntroductionVideo() {
    const loginUserId = await this.storage.get('loginUserId');
    this.commonProvider.PutMethod(Apiurl.DeleteIntroVideo + '/' + loginUserId, null).then(async (res: any) => {
      if (res) {
        this.toastService.showMessage('Intro Video deleted successfully')
        this.getProfileData();
      }
    }).catch((err: HttpErrorResponse) => {
      this.toastService.showMessage(err.message)
      console.log(err)
    })
  }


  // Profile more options
  async profileMoreOptions() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        // {
        //   text: 'Share Profile',
        //   handler: () => {
        //     this.shareProfile();
        //   }
        // },
        {
          text: 'Logout',
          handler: () => {
            this.logoOut();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // logoOut
  logoOut() {
    this.storage.clear();
    this.onboardingService.resetOnbordingValues();
    this.router.navigateByUrl('onboarding/onboarding-phone-number');
  }

  // Share Profile 
  shareProfile() {

  }
}
