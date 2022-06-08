export class LoginRequest {
    mobile: string;
    otp: string;
  
    constructor(mobile: string, otp: string) {
      this.mobile = mobile;
      this.otp = otp;
    }
  }
  