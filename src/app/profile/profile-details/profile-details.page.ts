import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ProfileService } from '../profile.service';
import { ExperiencesListPage } from '../experiences-list/experiences-list.page';
import { ExperienceAddEditPage } from '../experiences-list/experience-add-edit/experience-add-edit.page';
import { AddSkillsPage } from '../add-skills/add-skills.page';
import { SetHourlyRatesPage } from 'src/app/set-hourly-rates/set-hourly-rates.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { IntroductionVideoAddEditPage } from '../introduction-video-add-edit/introduction-video-add-edit.page';
import { PhotosVideosPage } from '../photos-videos/photos-videos.page';
@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  preferencesEditDisabled: boolean = false;
  constructor(
    public router: Router,
    public profileService: ProfileService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }


  async editProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfilePage,
    });
    await modal.present();
  }

  async introductionVideoEdit() {
    const modal = await this.modalCtrl.create({
      component: IntroductionVideoAddEditPage,
    });
    await modal.present();
  }

  viewAllRatings() {

  }

  async editWorkExperience() {
    const modal = await this.modalCtrl.create({
      component: ExperiencesListPage,
      componentProps: null
    });
    await modal.present();
  }

  async addSkill() {
    const obj = {
      editSkill: false
    };
    const modal = await this.modalCtrl.create({
      component: AddSkillsPage,
      componentProps: obj
    });
    await modal.present();
  }

  async addJobPreferences() {
    const modal = await this.modalCtrl.create({
      component: SetHourlyRatesPage,
      componentProps: { modal: true }
    });
    await modal.present();
  }

  async editSkill() {
    const obj = {
      editSkill: true
    };
    const modal = await this.modalCtrl.create({
      component: AddSkillsPage,
      componentProps: obj
    });
    await modal.present();
  }

  async addWorkExperience() {
    const obj = {
      editWorkExperience: false
    };
    const modal = await this.modalCtrl.create({
      component: ExperienceAddEditPage,
      componentProps: obj
    });
    await modal.present();
  }

  async addPhotosAndVideos() {
    // const modal = await this.modalCtrl.create({
    //   component: PhotosVideosPage,
    //   componentProps: null
    // });
    // await modal.present();
  }

  // disable or enable edit job preferences
  showPreferencesEdit() {
    this.preferencesEditDisabled = true;
    if (this.profileService?.jobPreferences?.jobTypePreferences?.length !== 0) {
      for (let index = 0; index < this.profileService?.jobPreferences?.jobTypePreferences.length; index++) {
        // if (this.profileService?.jobPreferences?.jobTypePreferences[index].status != "Pending") {
        //   this.preferencesEditDisabled = true;
        // }
      }
    }
    return this.preferencesEditDisabled;
  }

  // profile more options
  profileMoreOptions() {
    this.profileService.profileMoreOptions();
  }
}
