import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { OnboardingService } from '../onboarding.service';
import { isPlatform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
// import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';

@Component({
  selector: 'app-onboarding-personal-info',
  templateUrl: './onboarding-personal-info.page.html',
  styleUrls: ['./onboarding-personal-info.page.scss'],
})
export class OnboardingPersonalInfoPage implements OnInit {
  user = null;
  token = null;
  showError: boolean = false;
  @Output() openOnboardingProfilePicturePage = new EventEmitter();

  constructor(
    public onboardingService: OnboardingService,
    public router: Router,
    private http: HttpClient,
    public fb: Facebook
  ) {
    this.setupFbLogin();
  }

  setupFbLogin() {
    // FacebookLogin.initialize({ appId: '452657553465893' });
  }

  ngOnInit() {
    this.onboardingService.getPersonalInfo();
  }

  getFullName(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.onboardingService.full_name = event.ngModelData;
  }

  onPasteGetFullName(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.onboardingService.full_name = event.ngModelData;
  }

  async getEmailAddress(event) {
    this.onboardingService.email_address = event.ngModelData;
    await this.onboardingService.checkEmailValidation();
    this.disable();
  }

  getDOB(event) {
    this.onboardingService.dob = event.ngModelData;
    this.disable();
  }

  getReferralCode(event) {
    this.onboardingService.referralId = event.ngModelData;
  }

  savePersonalInfo(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.onboardingService.full_name || !this.onboardingService.email_address || !this.onboardingService.emailValid
      || !this.onboardingService.gender || !this.onboardingService.dob) {
      this.showError = true;
      return;
    } else {
      if (this.onboardingService.id == null) {
        this.onboardingService.savePersonalInfo();
      } else {
        this.onboardingService.updatePersonalInfo();
      }
    }
  }

  getGender(event) {
    this.onboardingService.gender = event.ngModelData;
    this.disable();
  }

  disable() {
    this.onboardingService.disabled = true;
    if (this.onboardingService.full_name && this.onboardingService.email_address && this.onboardingService.gender && this.onboardingService.emailValid && this.onboardingService.emailValid?.length != 0) {
      this.onboardingService.disabled = false;
    }
    return this.onboardingService.disabled;
  }

  async facebookLogin() {
    // const FACEBOOK_PERMISSIONS = [
    //   'email',
    //   'user_birthday',
    //   'user_photos',
    //   'user_gender',
    // ];
    // const result = await (<any>(
    //   FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
    // ));

    // if (result.accessToken) {
    //   // Login successful.
    //   console.log(`Facebook access token is ${result.accessToken.token}`);
    // }
    // const response = await FacebookLogin.getProfile<{
    //   email: string;
    //   first_name: string;
    //   last_name: string;
    //   middle_name: string;
    //   gender: string;
    //   birthday: string;
    //   hometown: string;
    //   picture: any;
    //   location: string;
    //   albums: string;
    //   is_guest_user: string;
    //   link: string;
    // }>({ fields: ['email', 'first_name', 'last_name', 'middle_name', 'gender', 'birthday', 'hometown', 'picture', 'location', 'albums', 'is_guest_user', 'link'] });

    // this.onboardingService.full_name = response?.first_name + response?.last_name
    // this.onboardingService.email_address = response?.email
    // this.onboardingService.dob = moment(new Date(response?.birthday)).format('YYYY-MM-DD')
    // this.onboardingService.gender = response?.gender.charAt(0).toUpperCase() + response?.gender.slice(1)
    // this.onboardingService.profile_picture = response?.picture?.data?.url
    // console.log(`Facebook user's email is `, response);



    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', res)
        if (res.authResponse.userID != '') {
          this.fb.api(res.authResponse.userID + "/?fields=id,name,email,first_name,last_name,middle_name,gender,birthday,hometown,picture,location,albums,is_guest_user,link",
            ["public_profile"]).then(response => {
              console.log('SUCCESS:', JSON.parse(JSON.stringify(response)));
              // this.fb.api('/' + /response.id, []).then(response => {
              this.onboardingService.full_name = JSON.parse(JSON.stringify(response))?.name
              this.onboardingService.email_address = JSON.parse(JSON.stringify(response))?.email
              this.onboardingService.dob = moment(new Date(JSON.parse(JSON.stringify(response))?.birthday)).format('YYYY-MM-DD')
              this.onboardingService.gender = JSON.parse(JSON.stringify(response))?.gender.charAt(0).toUpperCase() + JSON.parse(JSON.stringify(response))?.gender.slice(1)
              this.onboardingService.profile_picture = JSON.parse(JSON.stringify(response))?.picture?.data?.url
              // })
            }).catch(err => {
              console.log('ERROR:' + err);
            })
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
}
