import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingProfilePicturePage } from './onboarding-profile-picture.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardingProfilePicturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingProfilePicturePageRoutingModule {}
