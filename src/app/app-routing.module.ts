import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'onboarding/onboarding-phone-number', pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'otp',
    loadChildren: () => import('./otp/otp.module').then(m => m.OtpPageModule)
  },
  {
    path: 'onboarding/onboarding-phone-number',
    loadChildren: () => import('./onboarding/onboarding-phone-number/onboarding-phone-number.module').then(m => m.OnboardingPhoneNumberPageModule)
  },
  {
    path: 'onboarding/onboarding-header',
    loadChildren: () => import('./onboarding/onboarding-header/onboarding-header.module').then(m => m.OnboardingHeaderPageModule)
  },
  {
    path: 'onboarding/onboarding-otp',
    loadChildren: () => import('./onboarding/onboarding-otp/onboarding-otp.module').then(m => m.OnboardingOtpPageModule)
  },
  {
    path: 'onboarding/onboarding-personal-info',
    loadChildren: () => import('./onboarding/onboarding-personal-info/onboarding-personal-info.module').then(m => m.OnboardingPersonalInfoPageModule)
  },
  {
    path: 'onboarding/onboarding-profile-picture',
    loadChildren: () => import('./onboarding/onboarding-profile-picture/onboarding-profile-picture.module').then(m => m.OnboardingProfilePicturePageModule)
  },
  {
    path: 'onboarding/onboarding-job-type',
    loadChildren: () => import('./onboarding/onboarding-job-type/onboarding-job-type.module').then(m => m.OnboardingJobTypePageModule)
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule)
  },
  {
    path: 'internet-connection',
    loadChildren: () => import('./internet-connection/internet-connection.module').then(m => m.InternetConnectionPageModule)
  },
  {
    path: 'available-job-details/:id',
    loadChildren: () => import('./available-jobs/available-job-details/available-job-details.module').then(m => m.AvailableJobDetailsPageModule)
  },
  {
    path: 'available-job-details-global/:id',
    loadChildren: () => import('./available-jobs/available-job-details-global/available-job-details-global.module').then(m => m.AvailableJobDetailsGlobalModule)
  },
  {
    path: 'available-jobs-header',
    loadChildren: () => import('./available-jobs/available-jobs-header/available-jobs-header.module').then(m => m.AvailableJobsHeaderPageModule)
  },
  {
    path: 'set-hourly-rate',
    loadChildren: () => import('./available-jobs/set-hourly-rate/set-hourly-rate.module').then(m => m.SetHourlyRatePageModule)
  },
  {
    path: 'job-application-modal',
    loadChildren: () => import('./available-jobs/job-application-modal/job-application-modal.module').then(m => m.JobApplicationModalPageModule)
  },
  {
    path: 'upload-work-photo-view',
    loadChildren: () => import('./active-job/upload-work-photo-view/upload-work-photo-view.module').then(m => m.UploadWorkPhotoViewPageModule)
  },
  {
    path: 'edit-payment',
    loadChildren: () => import('./active-job/edit-payment/edit-payment.module').then(m => m.EditPaymentPageModule)
  },
  {
    path: 'job-rating',
    loadChildren: () => import('./active-job/job-rating/job-rating.module').then(m => m.JobRatingPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./my-earnings/payment/payment.module').then(m => m.PaymentPageModule)
  },
  {
    path: 'withdraw',
    loadChildren: () => import('./my-earnings/withdraw/withdraw.module').then(m => m.WithdrawPageModule)
  },
  {
    path: 'set-hourly-rates',
    loadChildren: () => import('./set-hourly-rates/set-hourly-rates.module').then(m => m.SetHourlyRatesPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./profile/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'experiences-list',
    loadChildren: () => import('./profile/experiences-list/experiences-list.module').then(m => m.ExperiencesListPageModule)
  },
  {
    path: 'experience-add-edit',
    loadChildren: () => import('./profile/experiences-list/experience-add-edit/experience-add-edit.module').then(m => m.ExperienceAddEditPageModule)
  },
  {
    path: 'add-skills',
    loadChildren: () => import('./profile/add-skills/add-skills.module').then(m => m.AddSkillsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./profile/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'introduction-video-add-edit',
    loadChildren: () => import('./profile/introduction-video-add-edit/introduction-video-add-edit.module').then(m => m.IntroductionVideoAddEditPageModule)
  },
  {
    path: 'app-update',
    loadChildren: () => import('./app-update/app-update.module').then(m => m.AppUpdatePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
