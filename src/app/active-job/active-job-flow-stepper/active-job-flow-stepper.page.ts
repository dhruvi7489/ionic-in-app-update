import { Component, Input, OnInit } from '@angular/core';
import { ActiveJobService } from '../active-job.service';

@Component({
  selector: 'app-active-job-flow-stepper',
  templateUrl: './active-job-flow-stepper.page.html',
  styleUrls: ['./active-job-flow-stepper.page.scss'],
})
export class ActiveJobFlowStepperPage implements OnInit {

  @Input('active-step') activeStep: any;
  @Input('label') label: any;

  constructor(
    public activeJobService: ActiveJobService
  ) { }

  ngOnInit() {
  }

}
