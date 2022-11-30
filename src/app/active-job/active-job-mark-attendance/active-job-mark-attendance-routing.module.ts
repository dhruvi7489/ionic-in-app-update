import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobMarkAttendancePage } from './active-job-mark-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobMarkAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobMarkAttendancePageRoutingModule {}
