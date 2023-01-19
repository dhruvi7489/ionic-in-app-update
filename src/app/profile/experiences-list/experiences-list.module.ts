import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperiencesListPageRoutingModule } from './experiences-list-routing.module';

import { ExperiencesListPage } from './experiences-list.page';
import { ProfileHeaderPageModule } from '../profile-header/profile-header.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExperiencesListPageRoutingModule,
    ProfileHeaderPageModule,
    DirectivesModule
  ],
  declarations: [ExperiencesListPage]
})
export class ExperiencesListPageModule { }