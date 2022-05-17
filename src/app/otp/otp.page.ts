import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  otpForm: FormGroup;
  @ViewChild('otp1', { static: false }) otp1: any;
  @ViewChild('otp2', { static: false }) otp2: any;
  @ViewChild('otp3', { static: false }) otp3: any;
  @ViewChild('otp4', { static: false }) otp4: any;
  @ViewChild('otp5', { static: false }) otp5: any;
  @ViewChild('otp6', { static: false }) otp6: any;
  phone_no: string = "";

  constructor(
    private route: Router,
    private location: Location) { }

  ngOnInit() {
    this.otpForm = new FormGroup({
      otp1: new FormControl('', Validators.required),
      otp2: new FormControl('', Validators.required),
      otp3: new FormControl('', Validators.required),
      otp4: new FormControl('', Validators.required),
      otp5: new FormControl('', Validators.required),
      otp6: new FormControl('', Validators.required)
    });

    if (history.state && history.state.phone_no) {
      this.phone_no = history.state.phone_no
    } else {
      this.route.navigate([""])
    }
  }

  otpController(event, next, prev) {
    if (next == '') {
      // this.submitOTP();
    }
    if (event.target.value.length < 1 && prev) {
      prev.setFocus();
    } else if (next && event.target.value.length > 0) {
      next.setFocus();
    } else {
      return 0;
    }
  }

  goBack() {
    this.location.back();
  }

  next() {
    const otp = this.otp1.el.value
      + this.otp2.el.value
      + this.otp3.el.value
      + this.otp4.el.value
      + this.otp5.el.value
      + this.otp6.el.value;
    if (otp.length === 6 && this.phone_no) {
    }
  }

}
