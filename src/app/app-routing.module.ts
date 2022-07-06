import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'onboarding', pathMatch: 'full'
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
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule)
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
    path: 'available-job-details',
    loadChildren: () => import('./available-jobs/available-job-details/available-job-details.module').then(m => m.AvailableJobDetailsPageModule)
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
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
