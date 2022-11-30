export class OTPModel {
    otp: string;
    otp_input_1: string;
    otp_input_2: string;
    otp_input_3: string;
    otp_input_4: string;
    otp_input_5: string;
    otp_input_6: string;

    constructor(otp: string, otp_input_1: string, otp_input_2: string, otp_input_3: string, otp_input_4: string, otp_input_5: string, otp_input_6: string) {
        this.otp = otp;
        this.otp_input_1 = otp_input_1;
        this.otp_input_2 = otp_input_2;
        this.otp_input_3 = otp_input_3;
        this.otp_input_4 = otp_input_4;
        this.otp_input_5 = otp_input_5;
        this.otp_input_6 = otp_input_6;
    }
}