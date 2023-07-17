import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-summary',
  templateUrl: './active-job-summary.page.html',
  styleUrls: ['./active-job-summary.page.scss'],
})
export class ActiveJobSummaryPage implements OnInit {

  constructor(
    public router: Router,
    public activeJobService: ActiveJobService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!this.activeJobService.activeJob?.job) {
      this.router.navigateByUrl('tabs/active-job')
    }
  }

  submitPayment() {
    this.activeJobService.savePayment();
    // this.router.navigateByUrl('job-rating');
  }

  editPayment() {
    this.router.navigateByUrl('edit-payment');
  }

}
