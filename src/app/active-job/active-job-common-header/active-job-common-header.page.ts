import { Component, OnInit } from '@angular/core';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-common-header',
  templateUrl: './active-job-common-header.page.html',
  styleUrls: ['./active-job-common-header.page.scss'],
})
export class ActiveJobCommonHeaderPage implements OnInit {

  constructor(
    public activeJobService: ActiveJobService
  ) { }

  ngOnInit() {
  }

}
