import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-experience-add-edit',
  templateUrl: './experience-add-edit.page.html',
  styleUrls: ['./experience-add-edit.page.scss'],
})
export class ExperienceAddEditPage implements OnInit {

  constructor(
    public profileService: ProfileService,
    public navParams: NavParams
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (!this.profileService.profileData) {
      await this.profileService.getProfileData();
      this.profileService.editWorkExperienceFlag = false;
      await this.addEditSet();
    }
    if (this.navParams.data) {
      this.profileService.editWorkExperienceFlag = await this.navParams.data.editWorkExperience;
      await this.addEditSet();
    } else {
      this.profileService.experienceDescription = null;
      this.profileService.links = [];
    }
  }

  async addEditSet() {
    if (!this.profileService.editWorkExperienceFlag) {
      this.profileService.experienceDescription = null;
      this.profileService.leftCharactersExperienceDescription = this.profileService.maxlengthExperienceDescription;
      this.profileService.links = [];
      await this.profileService.addLinks('', 0)
    } else {
      await this.profileService.getProfileData(this.navParams.data.index);
    }
  }

  addExperienceDescription(event) {
    this.profileService.experienceDescription = event.ngModelData;
    this.profileService.leftCharactersExperienceDescription = this.profileService.maxlengthExperienceDescription - this.profileService.experienceDescription.length;
  }

  addLink(event) {
    this.profileService.links[event.id].url = event.ngModelData;
  }

  addNewLink(i) {
    this.addLinks(i)
  }

  addLinks(i) {
    let obj;
    if (this.profileService.links.length < 3) {
      obj = {
        imgPath: '../../assets/imgs/Iconsax/Svg/All/outline/add.svg',
        imgPath1: '',
        id: this.profileService.links.length,
        url: ''
      }
      this.profileService.links.push(obj)
      if (this.profileService.links.length >= 2) {
        obj = {
          imgPath1: '../../assets/imgs/Iconsax/Svg/All/outline/minus.svg',
          imgPath: '',
          id: this.profileService.links[i].id,
          url: this.profileService.links[i].url
        }
        this.profileService.links[i] = obj
      }
    }
  }

  minusNewLink(i) {
    this.profileService.links.splice(i, 1)
  }

  deleteExperience() {
    this.profileService.deleteWorkExperience(this.navParams.data?.index);
  }

  saveExperience() {
    this.profileService.UpdateWorkExperience(this.navParams.data?.index);
  }
}
