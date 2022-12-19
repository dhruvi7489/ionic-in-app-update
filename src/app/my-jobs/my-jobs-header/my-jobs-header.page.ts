import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-my-jobs-header',
  templateUrl: './my-jobs-header.page.html',
  styleUrls: ['./my-jobs-header.page.scss'],
})
export class MyJobsHeaderPage implements OnInit {
  @Input() headerTitle?: string = "";
  @Input() counts?: number = 0;
  @Input() showBackBtn?: boolean = false;
  @Input() showProfileLogo?: boolean = false;
  @Input() showCloseBtn?: boolean = false;

  search: string = "";

  @Output() searchData = new EventEmitter();

  constructor(
    public location: Location
  ) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

}
