import { environment } from 'src/environments/environment';

const RoutePath = environment.api_url;
const ImagePath = environment.image_url;
const authServiceUrl = 'auth-service/v1/';
const jobSeekerServiceUrl = 'job-seeker-service/v1/';
const JobService = 'job-service/v1/';
const ratingService = 'rating-service/v1/';

export const Apiurl = {
    RoutePath: RoutePath,
    ImagePath: ImagePath,
    SendOTPUrl: authServiceUrl + 'auth/mobileNo/otp/',
    LoginWithOTPUrl: authServiceUrl + 'auth/login-otp',
    SavePersonalInfo: jobSeekerServiceUrl + 'jobseeker',
    GetPersonalInfo: jobSeekerServiceUrl + 'jobseeker/mobile/',
    GetPersonalInfo1: jobSeekerServiceUrl + 'jobseeker/',
    UploadProfilePicture: jobSeekerServiceUrl + 'fileupload/jobseeker/profile/',
    UpdateProfilePicture: jobSeekerServiceUrl + 'jobseeker/updateProfilePhoto/',
    GetJobCategory: JobService + 'jobCategory',
    SaveSelectedJobTypes: jobSeekerServiceUrl + 'jobpreference',
    SaveExperience: jobSeekerServiceUrl + 'jobseeker/updateWorkExperience/',
    GetJobsList: JobService + 'mobile/jobsearch',
    GetJobByJobId: JobService + 'mobile/jobview/',
    ApplyForSelectedJob: jobSeekerServiceUrl + 'jobpreference',
    GetMyJobsByLoginUserId: JobService + 'mobile/myjobs/',
    UpdateHourlyRate: jobSeekerServiceUrl + 'jobpreference/updateRate/',
    SubmitJobApplication: JobService + 'jobapplication',
    GetActiveJob: JobService + 'mobile/myjobs/activejob/',
    UploadAttendancePicture: JobService + 'fileupload/employmenthistory/',
    SaveAttendanceImgProof: JobService + 'employmentHistory/imageproof',
    MarkAttendance: JobService + 'employmentAttendance',
    GetEmployeementHistory: JobService + 'employmentHistory',
    GetEmployeementAttendance: JobService + 'employmentAttendance',
    SaveRating: ratingService + 'employer',
    Payment: jobSeekerServiceUrl + 'payment',
    GetEarningStatus: jobSeekerServiceUrl + 'payment/earningStats/',
};
