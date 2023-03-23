import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone, SecurityContext } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CommonProvider } from '../core/common';
import { LoginRequest } from '../core/modal/login-request.model';
import { LoginResponse } from '../core/modal/login-response.modal';
import { PersonalInfoRequest } from '../core/modal/personal-info.model';
import { Apiurl } from '../core/route';
import { TOKEN_KEY, TOKEN_TYPE } from '../core/storage-keys';
import { ToastService } from '../core/services/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { S3Object } from '../core/modal/s3-object.modal';
import { S3Util } from '../core/util/s3.util';
import { JobPreference, jobTypePreferencesRequests, JobTypeRequests } from '../core/modal/job-preference.modal';
import { Router } from '@angular/router';
import { LoadingService } from '../core/services/loading.service';
import { OTPModel } from '../core/modal/otp.modal';
import { LocationService } from '../core/services/location.service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Address } from '../core/modal/address.modal';
declare var google;

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  initial: string = null;

  isJobTypeFirstPage: boolean = false;
  showExperience: boolean = false;

  mobile: string = null;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '0',
  };
  otp: string = "";

  otp_input_1: string = null;
  otp_input_2: string = null;
  otp_input_3: string = null;
  otp_input_4: string = null;
  otp_input_5: string = null;
  otp_input_6: string = null;

  // otp: OTPModel;

  full_name: string = null;
  email_address: string = null;
  dob: any = moment(new Date()).format("YYYY-MM-DD");
  referralCode: string = null;
  gender: any;
  id: string = null;
  loginUserPersonalInfo = null;
  emailValid: any;
  emailValidationPattern: string = `^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`;
  profile_picture: any = null;

  description: string = null;
  link: string = null;
  maxlengthDescription = 200;
  leftCharacters = 0;

  jobTypeRequests: JobTypeRequests[];
  jobTypePreferencesRequests: jobTypePreferencesRequests[];

  links: any[] = [];
  jobCategories: any[] = [];
  jobPreferences: JobPreference;
  disabled = true;

  activeTab: string = '';
  addressObj: Address = new Address(40.730610, -73.935242);
  autocomplete: any = {
    query: ''
  };
  profileData: any = null;

  constructor(
    public commonProvider: CommonProvider,
    public toastService: ToastService,
    public actionSheetController: ActionSheetController,
    public sanitizer: DomSanitizer,
    public zone: NgZone,
    public router: Router,
    public loadingService: LoadingService,
    public locationService: LocationService,
    public modalCtrl: ModalController,
    public storage: Storage,
  ) {
    this.setInitialValues();
    this.checkRedirection();
    // Location cordinates subscribe if get
    this.locationService.getLocationCordinates().subscribe(async (res) => {
      if (res) {
        await this.getAddress(res?.coords?.latitude, res?.coords?.longitude);
      }
    })
  }

  // Get city, country, zip from latitude, longitude
  async getAddress(latitude, longitude) {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    this.addressObj.latitude = latitude;
    this.addressObj.longitude = longitude;
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, async (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.autocomplete.query = results[0].formatted_address;
          this.addressObj.address = results[0].formatted_address;
          this.addressObj.placeId = results[0].place_id;
          for (let i = 0; i < results[0].address_components.length; i++) {
            if (results[0].address_components[i].types[0] === 'locality') {
              this.addressObj.city = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] === 'administrative_area_level_1') {
              this.addressObj.region = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] === 'country') {
              this.addressObj.country = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] === 'postal_code') {
              this.addressObj.zip = results[0].address_components[i].long_name;
            }
          }
        } else {
          this.toastService.showMessage('No results found', 2000);
        }
      } else {
        this.toastService.showMessage('Google maps location failed due to: ' + status, 2000);
      }
      if (JSON.parse(loginUserInfo)) {
        this.updateProfile()
      } else {
        const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
        if (loginUserMobileNo) {
          this.getPersonalInfo()
        }
      }
    });
  }

  // Update login user personal Information
  async updateProfile() {
    const loginUserInfo = await this.storage.get('loginUserInfo');
    if (!JSON.parse(loginUserInfo)?.address) {
      this.loadingService.show();
      let obj = {
        dob: moment(new Date(JSON.parse(loginUserInfo)?.dob)).format("YYYY-MM-DD"),
        email: JSON.parse(loginUserInfo)?.email,
        gender: JSON.parse(loginUserInfo)?.gender,
        name: JSON.parse(loginUserInfo)?.name,
        address: this.addressObj,
        mobile: JSON.parse(loginUserInfo)?.mobile
      }
      await this.commonProvider.PutMethod(Apiurl.SavePersonalInfo + '/' + JSON.parse(loginUserInfo)?.id, obj).then(async (res: any) => {
        this.loadingService.dismiss();
        if (res) {
          this.toastService.showMessage('Login user location updated successfully');
          this.modalCtrl.dismiss();
          await this.getProfileData();
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    }
  }

  async setInitialValues() {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    this.mobile = loginUserMobileNo ? loginUserMobileNo : null;
  }

  // Send OTP to give mobile Number
  async sendOtp() {
    this.loadingService.show();
    await this.commonProvider.GetMethod(Apiurl.SendOTPUrl + this.mobile, null).then(async (res) => {
      this.loadingService.dismiss();
      this.storage.set('loginUserMobileNo', this.mobile);
      this.toastService.showMessage("OTP send to " + this.mobile);
      this.router.navigateByUrl('onboarding/onboarding-otp');
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Login after verifying OTP
  async login() {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    this.loadingService.show();
    return await this.commonProvider.PostMethod(Apiurl.LoginWithOTPUrl, new LoginRequest(loginUserMobileNo, this.otp)).then(async (res: LoginResponse) => {
      this.loadingService.dismiss();
      // if (res) {
      this.storage.set(TOKEN_KEY, res.jwtToken)
      this.storage.set(TOKEN_TYPE, res.tokentype)
      this.toastService.showMessage("Login successfully");
      // await this.router.navigateByUrl('onboarding/onboarding-personal-info');
      await this.getPersonalInfo();
      await this.updateToken();
      await this.checkRedirection();

      // }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Get login user Information by Mobile Number
  async getPersonalInfo(i?) {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    return await this.commonProvider.GetMethod(Apiurl.GetPersonalInfo + loginUserMobileNo, null).then(async (res: any) => {
      if (res) {
        this.loginUserPersonalInfo = res;
        this.id = this.loginUserPersonalInfo?.id;
        this.dob = moment(new Date(this.loginUserPersonalInfo?.dob)).format("YYYY-MM-DD");
        this.email_address = this.loginUserPersonalInfo?.email;
        this.gender = this.loginUserPersonalInfo?.gender;
        this.mobile = this.loginUserPersonalInfo?.mobile;
        this.full_name = this.loginUserPersonalInfo?.name;
        // this.full_name = null
        this.referralCode = this.loginUserPersonalInfo?.referralCode;
        this.storage.set('loginUserInfo', JSON.stringify(this.loginUserPersonalInfo));
        this.storage.set('loginUserId', this.id);
        this.storage.set('loginUserGender', this.gender);
        this.storage.set('loginUserInitial', await this.getLoginUserNameInitial(this.full_name));
        this.initial = await this.storage.get('loginUserInitial');
        if (this.loginUserPersonalInfo?.workExperiences && this.loginUserPersonalInfo?.workExperiences?.length != 0) {
          if (i) {
            this.description = this.loginUserPersonalInfo?.workExperiences[i]?.summary;
          } else {
            this.description = this.loginUserPersonalInfo?.workExperiences[0]?.summary;
          }
          this.leftCharacters = this.maxlengthDescription - (this.description?.length ? this.description?.length : 0);
          if (this.loginUserPersonalInfo?.workExperiences[0]?.workLink?.length == 0) {
            this.links = [];
            this.addLinks('', 0)
          } else {
            this.links = [];
            if (i) {
              this.loginUserPersonalInfo?.workExperiences[i]?.workLink?.forEach((element, index) => {
                if (index < 3) {
                  this.addLinks(element, index)
                }
              });
            } else {
              this.loginUserPersonalInfo?.workExperiences[0]?.workLink?.forEach((element, index) => {
                if (index < 3) {
                  this.addLinks(element, index)
                }
              })
            }
          }
        } else {
          this.links = [];
          await this.addLinks('', 0)
        }
        await this.checkEmailValidation();
        await this.setProfilePicture();
      } else {
        this.router.navigateByUrl('onboarding/onboarding-personal-info');
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Check email validation
  checkEmailValidation() {
    this.emailValid = this.email_address.match(this.emailValidationPattern);
  }

  // Get Initial letter from JobSeeker name
  getLoginUserNameInitial(full_name) {
    let initialOfName = null;
    if (full_name) {
      if (full_name.split(' ').length == 1) {
        initialOfName = full_name.split(' ')[0].split('')[0];
      }
      if (full_name.split(' ').length > 1) {
        initialOfName = full_name.split(' ')[0].split('')[0] + (full_name.split(' ')[1].split('')[0] ? full_name.split(' ')[1].split('')[0] : '')
      }
      return initialOfName ? initialOfName : full_name.split('')[0];
    }
  }

  // Save login user personal Information
  async savePersonalInfo() {
    await this.loadingService.show();
    await this.commonProvider.PostMethod(Apiurl.SavePersonalInfo, new PersonalInfoRequest(this.dob, this.email_address, this.gender, this.mobile, this.full_name, this.referralCode)).then(async (res: any) => {
      await this.loadingService.dismiss();
      if (this.locationService.locationCordinates) {
        await this.getAddress(this.locationService.locationCordinates?.coords?.latitude, this.locationService.locationCordinates?.coords?.longitude);
      }
      this.router.navigateByUrl('onboarding/onboarding-profile-picture');
      if (res) {
        this.toastService.showMessage("Personal information saved successfully");
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Update login user personal Information
  async updatePersonalInfo() {
    this.loginUserPersonalInfo.id = this.id;
    this.loginUserPersonalInfo.dob = new Date(this.dob);
    this.loginUserPersonalInfo.email = this.email_address;
    this.loginUserPersonalInfo.gender = this.gender;
    this.loginUserPersonalInfo.mobile = this.mobile;
    this.loginUserPersonalInfo.name = this.full_name;
    this.loginUserPersonalInfo.referralCode = this.referralCode;
    this.loginUserPersonalInfo.profilePhoto = this.profile_picture;
    await this.loadingService.show();
    return await this.commonProvider.PutMethod(Apiurl.SavePersonalInfo + '/' + this.id, this.loginUserPersonalInfo).then(async (res: any) => {
      await this.loadingService.dismiss();
      this.router.navigateByUrl('onboarding/onboarding-profile-picture');
      if (res) {
        this.toastService.showMessage("Personal information updated successfully");
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Save Profile Picture
  async setProfilePicture() {
    if (this.loginUserPersonalInfo.profilePhoto) {
      //   this.profile_picture = '../../../../assets/imgs/';
      //   if (this.loginUserPersonalInfo.gender == 'Male') {
      //     this.profile_picture += 'camera_placeholder.svg';
      //   } else {
      //     this.profile_picture += 'camera_placeholder.svg';
      //   }
      // } else {
      if (this.loginUserPersonalInfo?.profilePhoto?.includes('platform-lookaside.fbsbx.com')) {
        this.profile_picture = this.loginUserPersonalInfo.profilePhoto
      } else {
        this.profile_picture = this.commonProvider.ImagePath + this.loginUserPersonalInfo?.profilePhoto + "?" + new Date().getTime();
      }
    }
  }

  // Upload profile picture options
  async uploadProfilePicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(CameraSource.Camera);
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.pickImage(CameraSource.Photos);
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
  async pickImage(source: CameraSource) {
    let blobData = null;
    const image = await Camera.getPhoto({
      quality: 80,
      height: 700,
      width: 700,
      source,
      correctOrientation: true,
      resultType: CameraResultType.DataUrl,
    });
    blobData = this.b64toBlob(image.dataUrl.split('base64,')[1], `image/${image.format}`);
    await this.saveProfilePicture(blobData, image.format);
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
    await this.loadingService.show();
    await this.commonProvider.PostMethod(Apiurl.UploadProfilePicture + loginUserId, formData).then(async (res: S3Object) => {
      await this.loadingService.dismiss();
      if (res) {
        this.zone.run(() => {
          s3Object = res;
          this.profile_picture = S3Util.getFileUrl(res);
        })
        await this.commonProvider.PutMethod(Apiurl.UpdateProfilePicture + loginUserId, s3Object.key).then(async (res: any) => {
          await this.loadingService.dismiss();
          if (res) {
            this.loginUserPersonalInfo.profilePhoto = s3Object.key;
            await this.getPersonalInfo();
            this.toastService.showMessage("Profile picture saved successfully");
          }
        }).catch((err: HttpErrorResponse) => {
          this.loadingService.dismiss();
          console.log(err);
        })
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })

  }

  // Get profile data through login user ID
  async getProfileData() {
    const loginUserId = await this.storage.get('loginUserId');
    await this.loadingService.show();
    await this.commonProvider.GetMethod(Apiurl.GetPersonalInfo1 + loginUserId, null).then(async (res: any) => {
      await this.loadingService.dismiss();
      if (res) {
        this.loginUserPersonalInfo = res;
        this.id = this.loginUserPersonalInfo?.id;
        this.dob = moment(new Date(this.loginUserPersonalInfo?.dob)).format("YYYY-MM-DD");
        this.email_address = this.loginUserPersonalInfo?.email;
        this.gender = this.loginUserPersonalInfo?.gender;
        this.mobile = this.loginUserPersonalInfo?.mobile;
        this.full_name = this.loginUserPersonalInfo?.name;
        this.referralCode = this.loginUserPersonalInfo?.referralCode;
        if (this.loginUserPersonalInfo?.workExperiences && this.loginUserPersonalInfo?.workExperiences?.length != 0) {
          this.description = this.loginUserPersonalInfo?.workExperiences[0]?.summary;
          this.leftCharacters = this.maxlengthDescription - this.description?.length;
          if (this.loginUserPersonalInfo?.workExperiences[0].workLink.length == 0) {
            this.links = [];
            this.addLinks('', 0)
          } else {
            this.links = [];
            this.loginUserPersonalInfo?.workExperiences[0].workLink.forEach((element, index) => {
              if (index < 3) {
                this.addLinks(element, index)
              }
            });
          }
        }
        this.setProfilePicture();
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
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

  // Get jobs Categories
  async getJobCategory() {
    this.jobCategories = [];
    const loginUserId = await this.storage.get('loginUserId');
    let params = "?page=0&size=500&sort=createdOn,asc"
    await this.commonProvider.GetMethod(Apiurl.GetJobCategory + params, null).then(async (res: any) => {
      if (res) {
        this.jobCategories = res.content;
        let obj = '?page=0&size=1&sort=createdOn,desc&jobSeekerId=' + loginUserId;
        await this.commonProvider.GetMethod(Apiurl.JobPreference + obj, null).then(async (res: any) => {
          if (res) {
            this.jobPreferences = res.content[0];
            this.jobCategories.forEach(ele => {
              ele.jobTypes?.forEach(element => {
                element.active = false;
                this.jobPreferences?.jobTypePreferences?.forEach(e => {
                  if (e?.typeName == element?.jobTypeName) {
                    element.level = e.level;
                    element.maxHourlyRate = e.maxHourlyRate;
                    element.active = true;
                  }
                })
              });
            })
          }
        }).catch((err: HttpErrorResponse) => {
          console.log(err);
        })
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Check active job type
  checkCounterActive() {
    this.disabled = true;
    this.jobCategories?.forEach(ele => {
      ele.jobTypes?.forEach(element => {
        if (element.active) {
          this.disabled = false;
        }
      })
    })
  }

  // Save selected job types and categories
  async saveJobTypes(modal?) {
    const loginUserId = await this.storage.get('loginUserId');
    await this.loadingService.show();
    // let params:{"jobSeekerId":"6298989d3f1aa60aa83db2ab","jobTypeRequests":[{"typeId":"5fd9a452cb42211a2fd5d91e","typeName":"Product Demo Sales"},{"typeId":"5f97069ceb8c497cb290e241","typeName":"App promoter"}],"jobTypePreferences":[{"typeId":"5fd9a452cb42211a2fd5d91e","typeName":"Product Demo Sales"},{"typeId":"5f97069ceb8c497cb290e241","typeName":"App promoter"}]}
    this.jobTypeRequests = [];
    this.jobTypePreferencesRequests = [];
    this.jobCategories.forEach(ele => {
      let obj = {
        "typeId": ele?.id,
        "typeName": ele?.jobTypeName,
      }
      this.jobTypeRequests.push(obj);
      ele.jobTypes?.forEach(element => {
        let data = {
          "typeId": element?.jobTypeId,
          "typeName": element?.jobTypeName,
          // "level": element?.level
        }
        if (element.active) {
          this.jobTypePreferencesRequests.push(data);
        }
      })
    })

    let params = {
      "jobSeekerId": loginUserId,
      // "jobTypeRequests": this.jobTypeRequests,
      "jobTypeRequests": this.jobTypePreferencesRequests
    }
    if (this.jobPreferences?.id) {
      await this.commonProvider.PutMethod(Apiurl.JobPreference + '/' + this.jobPreferences?.id, params).then(async (res: any) => {
        await this.loadingService.dismiss();
        if (modal) {
          this.modalCtrl.dismiss();
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    } else {
      await this.commonProvider.PostMethod(Apiurl.JobPreference, params).then(async (res: S3Object) => {
        await this.loadingService.dismiss();
        if (modal) {
          this.modalCtrl.dismiss();
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    }
  }

  // Update login user Experience
  async editExperience(index) {
    const loginUserId = await this.storage.get('loginUserId');
    let workLink = [];
    let links = [];
    this.links.forEach(ele => {
      workLink.push(ele.url);
      links.push({ "url": ele.url })
    })
    if (this.description) {
      let params = {
        "summary": this.description,
        "workLink": workLink
      }
      await this.commonProvider.PutMethod(Apiurl.EditWorkExperience + loginUserId + '?updateIndex=' + index, params).then(async (res: any) => {
        if (res) {
          this.toastService.showMessage('Work Experience edited successfully')
          this.getProfileData();
          this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
        } else {
          this.toastService.showMessage('Work Experience not edited')
        }
      }).catch((err: HttpErrorResponse) => {
        this.toastService.showMessage('Work Experience not edited, Something went wrong...')
        console.log(err);
      })
    } else {
      // this.toastService.showMessage('Please enter valid experience and link')
      this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
    }
  }

  // Add login user Experiences
  async addExperience() {
    const loginUserId = await this.storage.get('loginUserId');
    let workLink = [];
    let links = [];
    this.links.forEach(ele => {
      workLink.push(ele.url);
      links.push({ "url": ele.url })
    })
    if (this.description) {
      let params = {
        "summary": this.description,
        "workLink": workLink
      }
      await this.commonProvider.PutMethod(Apiurl.SaveWorkExperience + loginUserId, params).then(async (res: any) => {
        if (res) {
          this.toastService.showMessage('Work Experience added successfully')
          this.getProfileData();
          this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
        } else {
          this.toastService.showMessage('Work Experience not added!')
        }
      }).catch((err: HttpErrorResponse) => {
        this.toastService.showMessage('Work Experience not added, Something went wrong...')
        console.log(err);
      })
    } else {
      // this.toastService.showMessage('Please enter valid experience and link')
      this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
    }
  }

  // Update Token
  async updateToken() {
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    const FCMToken = await this.storage.get('FCMToken');
    if (FCMToken) {
      if (loginUserMobileNo != null) {
        let obj = {
          deviceToken: FCMToken,
          mobile: loginUserMobileNo
        }
        await this.commonProvider.PutMethod(Apiurl.UpdateToken, obj).then(async (res: any) => {
          if (res) {
          }
        }).catch((err: HttpErrorResponse) => {
          console.log(err);
        })
      }
    }
  }

  // Check Redirection
  async checkRedirection() {
    await this.loadingService.show();
    const loginUserMobileNo = await this.storage.get('loginUserMobileNo');
    const TokenKey = await this.storage.get(TOKEN_KEY);
    const loginUserInfo = await this.storage.get('loginUserInfo');

    if (loginUserMobileNo && TokenKey) {
      await this.loadingService.dismiss();
      if (loginUserInfo) {
        await this.redirectToPage(JSON.parse(loginUserInfo));
      } else {
        await this.commonProvider.GetMethod(Apiurl.GetPersonalInfo + loginUserMobileNo, null).then(async (res: any) => {
          if (res) {
            await this.redirectToPage(res);
          } else {
            this.router.navigateByUrl('onboarding/onboarding-personal-info');
          }
        }).catch((err: HttpErrorResponse) => {
          console.log(err);
        })
      }
    } else {
      await this.loadingService.dismiss();
      //Location access permission 
      if (!this.locationService.locationPermissionGranted) {
        await this.locationService.requestLocationPermission(false);
      }

      if (loginUserMobileNo && !TokenKey) {
        this.router.navigateByUrl('onboarding/onboarding-otp');
      } else {
        this.router.navigateByUrl('onboarding/onboarding-phone-number');
      }
    }
  }

  // Redirect To Page
  async redirectToPage(res) {
    await this.loadingService.show();
    const loginUserId = await this.storage.get('loginUserId');
    const onboringFlowVisited = await this.storage.get('onboringFlowVisited');
    if (res && res.status != "Active") {
      await this.loadingService.dismiss();
      // if (res != null && res.address != null) {
      //   this.router.navigateByUrl('tabs/profile');
      // }
      if (res != null && res.profilePhoto == null && !onboringFlowVisited) {
        this.router.navigateByUrl('onboarding/onboarding-profile-picture');
      }
      else {
        await this.getJobCategory();
        if (!this.jobPreferences) {
          let obj = '?page=0&size=1&sort=createdOn,desc&jobSeekerId=' + loginUserId;
          await this.commonProvider.GetMethod(Apiurl.JobPreference + obj, null).then(async (res: any) => {
            if (res.content.length == 0) {
              this.router.navigateByUrl('onboarding/onboarding-job-type');
            } else {
              this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
            }
          })
        } else {
          if (this.jobPreferences?.jobTypePreferences.length == 0 && !onboringFlowVisited) {
            this.router.navigateByUrl('onboarding/onboarding-job-type');
          } else {
            this.onbordingFlowVisited();
            this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
          }
        }
      }
      // else {
      //   this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
      // }
    } else {
      await this.loadingService.dismiss();
      if (res == null) {
        this.router.navigateByUrl('onboarding/onboarding-personal-info');
      } else {
        if (!this.router.url.includes('tabs')) {
          this.onbordingFlowVisited();
          this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
        }
      }
    }
  }

  async onbordingFlowVisited() {
    await this.storage.set('onboringFlowVisited', true);
    console.log(await this.storage.get('onboringFlowVisited'))
  }

  // Reset Onboarding all values
  resetOnbordingValues() {
    this.isJobTypeFirstPage = false;
    this.showExperience = false;
    this.mobile = null;
    this.otp = "";
    this.otp_input_1 = null;
    this.otp_input_2 = null;
    this.otp_input_3 = null;
    this.otp_input_4 = null;
    this.otp_input_5 = null;
    this.otp_input_6 = null;
    this.full_name = null;
    this.email_address = null;
    this.dob = moment(new Date()).format("YYYY-MM-DD");
    this.referralCode = null;
    this.gender;
    this.id = null;
    this.loginUserPersonalInfo = null;
    this.emailValid;
    this.emailValidationPattern = `^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`;
    this.profile_picture = null;
    this.description = null;
    this.link = null;
    this.maxlengthDescription = 200;
    this.leftCharacters = 0;
    this.jobTypeRequests = null;
    this.jobTypePreferencesRequests = null;
    this.links = [];
    this.jobCategories = [];
    this.jobPreferences = null;
    this.disabled = true;
  }
}