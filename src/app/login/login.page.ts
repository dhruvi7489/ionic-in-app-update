import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  mobile = null;
  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  openOTPPage() {
    if (this.mobile) {
      const navigationExtras: NavigationExtras = {
        state: {
          mobile: this.mobile
        }
      };
      this.router.navigate(["otp"], navigationExtras);
    }
  }

  goToFacebook() {
  }

  onKeyUp(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.mobile = event.ngModelData;
  }

  onPasteOnKeyUp(event) {
    event.event.preventDefault();
    event.event.stopPropagation();
    this.mobile = event.ngModelData;
  }
}
