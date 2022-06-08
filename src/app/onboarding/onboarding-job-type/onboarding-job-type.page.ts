import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-job-type',
  templateUrl: './onboarding-job-type.page.html',
  styleUrls: ['./onboarding-job-type.page.scss'],
})
export class OnboardingJobTypePage implements OnInit {
  counter: any[] = [
    {
      active: false,
      page: "PhoneNumberPage"
    },
    {
      active: false,
      page: "OtpPage"
    },
    {
      active: false,
      page: "PersonalInfoPage"
    },
    {
      active: false,
      page: "ProfilePicturePage"
    },
    {
      active: false,
      page: "JobTypePage"
    }
  ];
  disabled = true;

  links: any[] = [];

  constructor(
    public onboardingService: OnboardingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.onboardingService.isJobTypeFirstPage = true;
    this.onboardingService.showExperience = false;
    this.checkCounterActive();
    this.onboardingService.getJobCategory();
    this.addLinks(0);
  }

  addMarketing(data) {
    data.active = true;
    this.checkCounterActive();
  }

  updateMarketing(data) {
    data.active = false;
    this.checkCounterActive();
  }

  addVideoProduction(data) {
    data.active = true;
    this.checkCounterActive();
  }

  updateVideoProduction(data) {
    data.active = false;
    this.checkCounterActive();
  }

  checkCounterActive() {
    this.disabled = true;
    this.counter.forEach(ele => {
      if (ele.active) {
        this.disabled = false;
      }
    })
  }

  experienceAdd() {
    this.onboardingService.isJobTypeFirstPage = false;
    if (this.onboardingService.showExperience == false) {
      this.onboardingService.showExperience = true;
    }
  }

  addDescription(event) {
    this.onboardingService.description = event.ngModelData;
    this.onboardingService.leftCharacters = this.onboardingService.maxlengthDescription - this.onboardingService.description.length;
  }

  addLink(event) {
    this.onboardingService.link = event.ngModelData;
    this.links[event.id].link = event.ngModelData;
  }

  addNewLink(i) {
    this.addLinks(i)
  }

  addLinks(i) {
    let obj;
    if (this.links.length < 3) {
      obj = {
        imgPath: '../../assets/imgs/Iconsax/Svg/All/outline/add.svg',
        imgPath1: '',
        id: this.links.length,
        link: ''
      }
      this.links.push(obj)
      if (this.links.length >= 2) {
        obj = {
          imgPath1: '../../assets/imgs/Iconsax/Svg/All/outline/minus.svg',
          imgPath: '',
          id: this.links[i].id,
          link: this.links[i].link
        }
        this.links[i] = obj
      }
    }
  }

  minusNewLink(i) {
    this.links.splice(i, 1)
  }

  skip() {
    // this.router.navigateByUrl('tabs/tabs1');
  }

  continue() {
    // this.router.navigateByUrl('tabs/tabs1');
  }
}
