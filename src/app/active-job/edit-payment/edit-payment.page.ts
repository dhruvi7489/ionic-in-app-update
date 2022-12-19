import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.page.html',
  styleUrls: ['./edit-payment.page.scss'],
})
export class EditPaymentPage implements OnInit {

  constructor(
    public router: Router,
    public activeJobService: ActiveJobService,
    public location: Location
  ) { }

  ngOnInit() {
  }

  addExpectedAmount(event) {
    this.activeJobService.expectedAmount = event.ngModelData;
  }

  addReasonForExpectedAmount(event) {
    this.activeJobService.reasonForExpectedAmount = event.ngModelData;
    this.activeJobService.leftCharactersForExpectedAmount = this.activeJobService.maxlengthReasonForExpectedAmount - this.activeJobService.reasonForExpectedAmount.length;
  }

  submitUpdatedAmount() {
    // this.router.navigateByUrl('tabs/active-job');
    this.location.back();
  }
}
