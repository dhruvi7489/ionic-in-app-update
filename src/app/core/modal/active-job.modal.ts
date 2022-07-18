import { MyJob } from './my-job.modal';
import { EmploymentHistory } from './employment-history.modal.';
import { EmploymentDate, Employment } from './employment.modal';
import { Attendance } from './attendance.modal';
import { Rating } from './rating.modal';

export class ActiveJob {
    mobile: any;
    job: MyJob;
    employment: Employment;
    activeDay: EmploymentDate;
    located: boolean;
    attendance: Attendance;
    jobStarted: boolean;
    timer: any;
    history: EmploymentHistory;
    lastLocation: any;
    rating: Rating;

}
