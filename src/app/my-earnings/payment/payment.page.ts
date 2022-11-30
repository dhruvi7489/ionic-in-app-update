import { Component, OnInit } from '@angular/core';
// import { AlertController } from '@ionic/angular';
import { MyEarningsService } from '../my-earnings.service';
// import { Checkout } from 'capacitor-razorpay';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  disabled: boolean = false;

  constructor(
    public myEarningsService: MyEarningsService,
    // private alertController: AlertController
  ) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.myEarningsService.getAccountDetails();
  }

  getAccountNumber(event) {
    this.myEarningsService.accountNumber = event.ngModelData;
  }

  getConfirmAccountNumber(event) {
    this.myEarningsService.confirm_accountNumber = event.ngModelData;
  }

  getIFSCCode(event) {
    this.myEarningsService.ifscCode = event.ngModelData;
  }

  getAccountentName(event) {
    this.myEarningsService.nameOnAccount = event.ngModelData;
  }

  authorizeBankDetails(event) {
    console.log(event)
    this.myEarningsService.authorizeBankDetails = event.ngModelData;
  }

  saveAccountFormDetails() {
    this.myEarningsService.saveAccountDetails();
  }

  disable() {
    this.disabled = true;
    if (this.myEarningsService?.accountNumber && this.myEarningsService?.confirm_accountNumber && this.myEarningsService?.ifscCode &&
      this.myEarningsService?.nameOnAccount && this.myEarningsService?.authorizeBankDetails == true &&
      this.myEarningsService?.confirm_accountNumber == this.myEarningsService?.accountNumber) {
      this.disabled = false;
    }
    return this.disabled;
  }


  // async payWithRazorpay() {
  //   const options = {
  //     key: 'rzp_test_svKFMbRMkWDzNB',
  //     amount: '100000',
  //     description: 'Transection test',
  //     image: 'https://i.imgur.com/3g7nmJC.jpg',
  //     order_id: 'order_KdpWSnARIzinjZ',//Order ID generated in Step 1
  //     currency: 'INR',
  //     name: 'Dhruvi patel',
  //     prefill: {
  //       email: 'dhruvi7489@gmail.com',
  //       contact: '7048450515'
  //     },
  //     theme: {
  //       color: '#3399cc'
  //     }
  //   }
  //   try {
  //     let data = (await Checkout.open(options));
  //     console.log(data.response + "AcmeCorp");
  //     console.log(JSON.stringify(data))
  //   } catch (error) {
  //     //it's paramount that you parse the data into a JSONObject
  //     let errorObj = JSON.parse(error['code'])
  //     alert(errorObj.description);
  //     alert(errorObj.code);

  //     alert(errorObj.reason);
  //     alert(errorObj.step);
  //     alert(errorObj.source);
  //     alert(errorObj.metadata.order_id);
  //     alert(errorObj.metadata.payment_id);

  //   }
  // }
  // async presentAlert(response: string) {
  //   // let responseObj = JSON.parse(response)
  //   console.log("message" + response['razorpay_payment_id']);
  //   const alert = await this.alertController.create({
  //     message: response['razorpay_payment_id'],
  //     backdropDismiss: true,
  //   });

  //   await alert.present();
  // }

}
