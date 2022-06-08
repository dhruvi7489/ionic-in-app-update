export class PersonalInfoRequest {
  dob: string;
  email: string;
  gender: string;
  mobile: string;
  name: string;
  referralCode: string;

  constructor(dob: string, email: string, gender: string, mobile: string, name: string, referralCode: string) {
    this.dob = dob;
    this.email = email;
    this.gender = gender;
    this.mobile = mobile;
    this.name = name;
    this.referralCode = referralCode;
  }
}
