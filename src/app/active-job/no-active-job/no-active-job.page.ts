import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-no-active-job',
  templateUrl: './no-active-job.page.html',
  styleUrls: ['./no-active-job.page.scss'],
})
export class NoActiveJobPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  applyForJob() {
    this.router.navigateByUrl("tabs/available-jobs/available-jobs-list")
  }
}
