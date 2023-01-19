import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSkillsPageRoutingModule } from './add-skills-routing.module';

import { AddSkillsPage } from './add-skills.page';
import { ProfileHeaderPageModule } from '../profile-header/profile-header.module';
import { CustomButtonModule } from 'w4u-custom-components';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSkillsPageRoutingModule,
    ProfileHeaderPageModule,
    CustomButtonModule,
    DirectivesModule
  ],
  declarations: [AddSkillsPage]
})
export class AddSkillsPageModule { }
