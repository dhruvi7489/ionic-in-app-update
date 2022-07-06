import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-active-job-header',
  templateUrl: './active-job-header.page.html',
  styleUrls: ['./active-job-header.page.scss'],
})
export class ActiveJobHeaderPage implements OnInit {

  @Input() headerTitle?: string = "";
  @Input() counts?: string = "";
  @Input() showSearch?: boolean = false;
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

  searchKeyUp(event) {
    this.search = event.ngModelData;
    this.searchData.emit(this.search);
  }

  back() {
    this.location.back();
  }

}
