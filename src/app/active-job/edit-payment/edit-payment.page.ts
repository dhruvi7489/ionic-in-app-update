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
  expectedAmount = null;

  constructor(
    public router: Router,
    public activeJobService: ActiveJobService,
    public location: Location,
  ) { }

  ngOnInit() {
    this.activeJobService.reasonForExpectedAmount = null;
  }

  addExpectedAmount(event) {
    this.expectedAmount = event.ngModelData ? parseFloat(parseFloat(event.ngModelData).toFixed(2)) : null;
  }

  addReasonForExpectedAmount(event) {
    this.activeJobService.reasonForExpectedAmount = event.ngModelData;
    this.activeJobService.leftCharactersForExpectedAmount = this.activeJobService.maxlengthReasonForExpectedAmount - this.activeJobService.reasonForExpectedAmount.length;
  }

  submitUpdatedAmount() {
    // this.router.navigateByUrl('tabs/active-job');
    this.activeJobService.expectedAmount = this.expectedAmount
    this.location.back();
  }
}
