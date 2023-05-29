import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/profile/profile.service';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-job-type',
  templateUrl: './onboarding-job-type.page.html',
  styleUrls: ['./onboarding-job-type.page.scss'],
})
export class OnboardingJobTypePage implements OnInit {
  constructor(
    public onboardingService: OnboardingService,
    public router: Router,
    public profileService: ProfileService
  ) { }

  ngOnInit() { }

  async ionViewWillEnter() {
    this.onboardingService.isJobTypeFirstPage = true;
    this.onboardingService.showExperience = false;
    await this.onboardingService.getJobCategory();
    await this.onboardingService.checkCounterActive();
    await this.onboardingService.getPersonalInfo(0);
  }

  addSubJobCategory(data) {
    data.active = !data.active;
    this.onboardingService.checkCounterActive();
  }

  saveJobTypes() {
    this.onboardingService.saveJobTypes();
    this.onboardingService.isJobTypeFirstPage = false;
    if (this.onboardingService.showExperience == false) {
      this.onboardingService.showExperience = true;
    }
  }

  addDescription(event) {
    this.onboardingService.description = event.ngModelData;
    this.onboardingService.leftCharacters = this.onboardingService?.maxlengthDescription - this.onboardingService.description?.length;
  }

  addLink(event) {
    this.onboardingService.links[event.id].url = event.ngModelData;
  }

  addNewLink(i) {
    this.addLinks(i)
  }

  addLinks(i) {
    let obj;
    if (this.onboardingService.links.length < 3) {
      obj = {
        imgPath: '../../assets/imgs/Iconsax/Svg/All/outline/add.svg',
        imgPath1: '',
        id: this.onboardingService.links.length,
        url: ''
      }
      this.onboardingService.links.push(obj)
      if (this.onboardingService.links.length >= 2) {
        obj = {
          imgPath1: '../../assets/imgs/Iconsax/Svg/All/outline/minus.svg',
          imgPath: '',
          id: this.onboardingService.links[i].id,
          url: this.onboardingService.links[i].url
        }
        this.onboardingService.links[i] = obj
      }
    }
  }

  minusNewLink(i) {
    this.onboardingService.links.splice(i, 1)
  }

  skip() {
    this.onboardingService.onbordingFlowVisited();
    this.router.navigateByUrl('tabs/available-jobs/available-jobs-list');
  }

  continue() {
    this.onboardingService.onbordingFlowVisited();
    if (this.onboardingService.loginUserPersonalInfo?.workExperiences && this.onboardingService.loginUserPersonalInfo?.workExperiences?.length != 0) {
      this.onboardingService.editExperience(0);
    } else {
      this.onboardingService.addExperience();
    }
  }
}
