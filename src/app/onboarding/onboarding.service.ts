import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable, NgZone, Output, Sanitizer, SecurityContext } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { CommonProvider } from '../core/common';
import { LoginRequest } from '../core/modal/login-request.model';
import { LoginResponse } from '../core/modal/login-response.modal';
import { PersonalInfoRequest } from '../core/modal/personal-info.model';
import { Apiurl } from '../core/route';
import { TOKEN_KEY } from '../core/storage-keys';
import { ToastService } from '../services/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { S3Object } from '../core/modal/s3-object.modal';
import { S3Util } from '../core/util/s3.util';
import { JobTypeRequests } from '../core/modal/job-preference.modal';
import { WorkExperience } from '../core/modal/experience.modal';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  isJobTypeFirstPage: boolean = false;
  showExperience: boolean = false;

  phone_no = null;

  otp: string = "";

  otp_input_1: string = null;
  otp_input_2: string = null;
  otp_input_3: string = null; 
  otp_input_4: string = null;
  otp_input_5: string = null;
  otp_input_6: string = null;

  full_name: string = null;
  email_address: string = null;
  dob: any = moment(new Date()).format("YYYY-MM-DD");
  referral_code: string = null;
  gender: any;
  id: string = null;
  loginUserPersonalInfo = null;

  profile_picture: any = null;

  description: string = null;
  link: string = null;
  maxlengthDescription = 200;
  leftCharacters = 0;

  jobTypeRequests: JobTypeRequests[];
  workExperiences: WorkExperience[];

  constructor(
    public commonProvider: CommonProvider,
    public toastService: ToastService,
    public actionSheetController: ActionSheetController,
    public sanitizer: DomSanitizer,
    public zone: NgZone
  ) { }

  async sendOtp() {
    return await this.commonProvider.GetMethod(Apiurl.SendOTPUrl + this.phone_no, null).then(async (res) => {
      console.log(res)
      if (res) {
        this.toastService.showMessage("OTP send to" + this.phone_no);
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async login() {
    return await this.commonProvider.PostMethod(Apiurl.LoginWithOTPUrl, new LoginRequest(this.phone_no, this.otp)).then(async (res: LoginResponse) => {
      console.log(res)
      if (res) {
        if (res) {
          localStorage.setItem(TOKEN_KEY, res.jwtToken)
          this.toastService.showMessage("Login successfully");
        }
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  async getPersonalInfo() {
    return await this.commonProvider.GetMethod(Apiurl.GetPersonalInfo + this.phone_no, null).then(async (res: any) => {
      console.log(res)
      if (res) {
        this.loginUserPersonalInfo = res;
        this.id = this.loginUserPersonalInfo?.id;
        this.dob = moment(new Date(this.loginUserPersonalInfo?.dob)).format("YYYY-MM-DD");
        this.email_address = this.loginUserPersonalInfo?.email;
        this.gender = this.loginUserPersonalInfo?.gender;
        this.phone_no = this.loginUserPersonalInfo?.mobile;
        this.full_name = this.loginUserPersonalInfo?.name;
        this.referral_code = this.loginUserPersonalInfo?.referral_code;
        await this.setProfilePicture();
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async savePersonalInfo() {
    return await this.commonProvider.PostMethod(Apiurl.SavePersonalInfo, new PersonalInfoRequest(this.dob, this.email_address, this.gender, this.phone_no, this.full_name, this.referral_code)).then(async (res: any) => {
      console.log(res)
      if (res) {
        this.toastService.showMessage("Personal information saved successfully");
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  async updatePersonalInfo() {
    this.loginUserPersonalInfo.id = this.id;
    this.loginUserPersonalInfo.dob = new Date(this.dob);
    this.loginUserPersonalInfo.email = this.email_address;
    this.loginUserPersonalInfo.gender = this.gender;
    this.loginUserPersonalInfo.mobile = this.phone_no;
    this.loginUserPersonalInfo.name = this.full_name;
    this.loginUserPersonalInfo.referral_code = this.referral_code;

    return await this.commonProvider.PutMethod(Apiurl.SavePersonalInfo + '/' + this.id, this.loginUserPersonalInfo).then(async (res: any) => {
      console.log(res)
      if (res) {
        this.toastService.showMessage("Personal information updated successfully");
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }

  async setProfilePicture() {
    if (!this.loginUserPersonalInfo.profilePhoto) {
      this.profile_picture = '../../../../assets/imgs/';
      if (this.loginUserPersonalInfo.gender == 'Male') {
        this.profile_picture += 'male_avatar.svg';
      } else {
        this.profile_picture += 'female_avatar.svg';
      }
    } else {
      this.profile_picture = this.commonProvider.ImagePath + this.loginUserPersonalInfo?.profilePhoto + "?" + new Date().getTime();
    }
  }

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

  async pickImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 80,
      source,
      correctOrientation: true,
      resultType: CameraResultType.DataUrl,
    });
    const blobData = this.b64toBlob(image.dataUrl.split('base64,')[1], `image/${image.format}`);
    await this.saveProfilePicture(blobData, image.format);
  }

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

  cleanURL(oldURL): SafeUrl {
    return this.sanitizer.sanitize(SecurityContext.URL, oldURL)
  }

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

  async saveProfilePicture(blobData, format) {
    console.log(format)
    let s3Object: S3Object = null;
    const formData = new FormData();
    let filename = "IMG-" + this.rendomFileName(5) + ".jpg";
    formData.append('id', this.loginUserPersonalInfo.id);
    formData.append('profile', blobData, filename);

    await this.commonProvider.PostMethod(Apiurl.UploadProfilePicture + this.loginUserPersonalInfo.id, formData).then(async (res: S3Object) => {
      console.log(res)
      if (res) {
        this.zone.run(() => {
          s3Object = res;
          this.profile_picture = S3Util.getFileUrl(res);
        })
        await this.commonProvider.PutMethod(Apiurl.UpdateProfilePicture + this.loginUserPersonalInfo.id, s3Object.key).then(async (res: any) => {
          console.log(res)
          this.loginUserPersonalInfo.profilePhoto = s3Object.key;
          await this.getProfileData();
          if (res) {
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

  async getProfileData() {
    await this.commonProvider.GetMethod(Apiurl.GetPersonalInfo1 + this.loginUserPersonalInfo.id, null).then(async (res: any) => {
      console.log(res)
      if (res) {
        this.loginUserPersonalInfo = res;
        this.id = this.loginUserPersonalInfo?.id;
        this.dob = moment(new Date(this.loginUserPersonalInfo?.dob)).format("YYYY-MM-DD");
        this.email_address = this.loginUserPersonalInfo?.email;
        this.gender = this.loginUserPersonalInfo?.gender;
        this.phone_no = this.loginUserPersonalInfo?.mobile;
        this.full_name = this.loginUserPersonalInfo?.name;
        this.referral_code = this.loginUserPersonalInfo?.referral_code;
        this.setProfilePicture();
      }
    })
  }

  async getJobCategory() {
    let params = "?page=0&size=500&sort=createdOn,asc"
    return await this.commonProvider.GetMethod(Apiurl.GetJobCategory + params, null).then(async (res) => {
      console.log(res)
      if (res) {

      }
    }).catch(err => {
      console.log(err)
    })
  }

  async saveJobTypes() {
    // let params:{"jobSeekerId":"6298989d3f1aa60aa83db2ab","jobTypeRequests":[{"typeId":"5fd9a452cb42211a2fd5d91e","typeName":"Product Demo Sales"},{"typeId":"5f97069ceb8c497cb290e241","typeName":"App promoter"}],"jobTypePreferences":[{"typeId":"5fd9a452cb42211a2fd5d91e","typeName":"Product Demo Sales"},{"typeId":"5f97069ceb8c497cb290e241","typeName":"App promoter"}]}
    let params = {
      "jobSeekerId": this.loginUserPersonalInfo.id,
      "jobTypeRequests": this.jobTypeRequests,
      "jobTypePreferences": this.jobTypeRequests
    }
    await this.commonProvider.PostMethod(Apiurl.SaveSelectedJobTypes, params).then(async (res: S3Object) => {
    }).catch(err => {
      console.log(err)
    })
  }

  async SaveExperience() {
    // let params=[{"links":[{"url":"dfdgg"},{"url":"fgty4"},{"url":"654h"}],"summary":"dfd","workLink":["dfdgg","fgty4","654h"]}]
    let params = this.workExperiences;
    await this.commonProvider.PutMethod(Apiurl.SaveExperience + this.loginUserPersonalInfo.id, params).then(async (res: any) => {
      console.log(res)
      if (res) {
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err)
    })
  }
}
