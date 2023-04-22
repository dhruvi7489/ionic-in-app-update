import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ProfileService } from '../profile.service';
import { ExperienceAddEditPage } from './experience-add-edit/experience-add-edit.page';

@Component({
  selector: 'app-experiences-list',
  templateUrl: './experiences-list.page.html',
  styleUrls: ['./experiences-list.page.scss'],
})
export class ExperiencesListPage implements OnInit {
  show: boolean = false;

  constructor(
    public router: Router,
    public profileService: ProfileService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (!this.profileService.profileData) {
      await this.profileService.getProfileData();
    }
  }

  async editExperience(index) {
    const obj = {
      editWorkExperience: true,
      index: index
    }
    const modal = await this.modalCtrl.create({
      component: ExperienceAddEditPage,
      componentProps: obj
    });
    await modal.present();
  }

}
