import {Address} from './address.modal';

export class Employment {
    id: string;
    briefing: string[];
    dates: EmploymentDate[];
    employerId: string;
    employerPaymentInfos: EmploymentPaymentInfo;
    employmentType: string;
    instructions: string;
    jobId: string;
    jobSeekerPaymentInfo: JobSeekerPaymentInfo;
    location: Address;
    noOfFemaleRequired: number;
    noOfMaleRequired: number;
    recurringDays: string[];
    status: string;
    termsForLatePayment: string;
    attendanceLogInSelfieRequired: boolean;
    attendanceLogOutSelfieRequired: boolean;
    attendanceLocationTrackerRequired: boolean;
    attendanceAtVenueRequired: boolean;

    // other than api
    job: any;
}


export class EmploymentPaymentInfo {
    level: string;
    gender: string;
    maxRate: number;
}

export class JobSeekerPaymentInfo {
    level: string;
    maxRate: number;
    minRate: number;
}


export class EmploymentDate {
    date: any;
    timeFrom: any;
    timeTo: any;
    isActive: boolean;
    isComplete: boolean;
}


