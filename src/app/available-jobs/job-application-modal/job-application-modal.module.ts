import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobApplicationModalPageRoutingModule } from './job-application-modal-routing.module';

import { JobApplicationModalPage } from './job-application-modal.page';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobApplicationModalPageRoutingModule,
    DirectivesModule
  ],
  declarations: [JobApplicationModalPage],
})
export class JobApplicationModalPageModule { }
