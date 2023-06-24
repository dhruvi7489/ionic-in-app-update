import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WithdrawalResponseModalPage } from './withdrawal-response-modal.page';

const routes: Routes = [
  {
    path: '',
    component: WithdrawalResponseModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WithdrawalResponseModalPageRoutingModule {}
