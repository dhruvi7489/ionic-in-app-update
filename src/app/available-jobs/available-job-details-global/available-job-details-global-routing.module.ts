import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailableJobDetailsGlobalComponent } from './available-job-details-global.component';

const routes: Routes = [
  {
    path: '',
    component: AvailableJobDetailsGlobalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableJobDetailsGlobalPageRoutingModule { }
