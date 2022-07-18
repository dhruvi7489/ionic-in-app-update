import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyEarningsService } from '../my-earnings.service';

@Component({
  selector: 'app-my-earnings-header',
  templateUrl: './my-earnings-header.page.html',
  styleUrls: ['./my-earnings-header.page.scss'],
})
export class MyEarningsHeaderPage implements OnInit {

  @Input() headerTitle?: string = "";
  @Input() showBackBtn?: boolean = false;
  @Input() showContactIcon?: boolean = false;

  search: string = "";

  @Output() searchData = new EventEmitter();

  constructor(
    public location: Location,
    public myEarningsService: MyEarningsService
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

  goToContact() {
    this.myEarningsService.goToContact();
  }

}
