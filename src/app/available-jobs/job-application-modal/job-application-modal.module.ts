import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JobApplicationModalPageRoutingModule } from './job-application-modal-routing.module';

import { JobApplicationModalPage } from './job-application-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JobApplicationModalPageRoutingModule,
  ],
  declarations: [JobApplicationModalPage],
})
export class JobApplicationModalPageModule {}
