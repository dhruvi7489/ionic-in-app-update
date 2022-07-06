import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  @ViewChild('otp1', { static: false }) otp1: any;
  @ViewChild('otp2', { static: false }) otp2: any;
  @ViewChild('otp3', { static: false }) otp3: any;
  @ViewChild('otp4', { static: false }) otp4: any;
  @ViewChild('otp5', { static: false }) otp5: any;
  @ViewChild('otp6', { static: false }) otp6: any;
  mobile: string = "";
  otp: string = "";

  constructor(
    private route: Router,
    private location: Location) { }

  ngOnInit() {
    if (history.state && history.state.mobile) {
      this.mobile = history.state.mobile;
    } else {
      this.route.navigate([""]);
    }
  }

  goBack() {
    this.location.back();
  }

  otpEnter(otp) {
    this.otp = otp;
  }

  nextBtnClick() {
    this.route.navigate(["onboarding"]);
  }

}
