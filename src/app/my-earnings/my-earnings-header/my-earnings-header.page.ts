import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  @Input() isModal?: boolean = false;
  @Input() showSearch?: string = "";

  search: string = "";

  @Output() searchData = new EventEmitter();

  constructor(
    public location: Location,
    public myEarningsService: MyEarningsService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  searchKeyUp(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.search = event.ngModelData;
    this.searchData.emit(this.search);
  }

  onPasteSearchKeyUp(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.search = event.ngModelData;
    this.searchData.emit(this.search);
  }

  back() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    } else {
      this.location.back();
    }
  }

  goToContact() {
    this.myEarningsService.goToContact();
  }

}
