import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { OnboardingService } from 'src/app/onboarding/onboarding.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.page.html',
  styleUrls: ['./add-skills.page.scss'],
})
export class AddSkillsPage implements OnInit {

  pageTitle = 'Add skill';
  constructor(
    public onboardingService: OnboardingService,
    public profileService: ProfileService,
    public navParams: NavParams,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.onboardingService.getJobCategory();
    this.onboardingService.checkCounterActive();
    this.pageTitle = this.navParams.get('editSkill') ? 'Edit skill' : 'Add skill';
  }

  addSubJobCategory(data) {
    data.active = !data.active;
    this.onboardingService.checkCounterActive();
  }

  async saveJobTypes() {
    await this.onboardingService.saveJobTypes(true);
    await this.profileService.getJobPreference();
  }
}
