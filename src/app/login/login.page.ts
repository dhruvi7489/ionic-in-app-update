import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phone_no = null;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  openOTPPage() {
    if (this.phone_no) {
      const navigationExtras: NavigationExtras = {
        state: {
          phone_no: this.phone_no
        }
      };
      console.log(navigationExtras)
      this.router.navigate(["otp"], navigationExtras);
    }
  }

  goToFacebook() {
  }

  onKeyUp(event) {
    this.phone_no = event;
  }
}
