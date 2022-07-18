import { JobSeekerPaymentInfo, EmploymentDate } from './employment.modal';
import { Address } from './address.modal';

export class MyJob {
    employmentId: string;
    employerId: string;
    title: string;
    jobId: string;
    totalHours: any;
    status: string;
    dates: EmploymentDate[];
    employmentType: string;
    jobSeekerPaymentInfo: JobSeekerPaymentInfo;
    location: Address;
    rating: any;
    recurringDays: any[];
    hourlyRate: any;
    attendanceLogInSelfieRequired: boolean;
    attendanceLogOutSelfieRequired: boolean;
    attendanceLocationTrackerRequired: boolean;
    attendanceAtVenueRequired: boolean;
    createdDate: any;
    employmentTitle: string;
    // other
    basePrice: any[];

}
