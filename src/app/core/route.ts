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
    UpdateToken: jobSeekerServiceUrl + 'jobseeker/updatetoken',
    SendOTPUrl: authServiceUrl + 'auth/mobileNo/otp/',
    LoginWithOTPUrl: authServiceUrl + 'auth/login-otp',
    SavePersonalInfo: jobSeekerServiceUrl + 'jobseeker',
    GetPersonalInfo: jobSeekerServiceUrl + 'jobseeker/mobile/',
    GetPersonalInfo1: jobSeekerServiceUrl + 'jobseeker/',
    UploadProfilePicture: jobSeekerServiceUrl + 'fileupload/jobseeker/profile/',
    UpdateProfilePicture: jobSeekerServiceUrl + 'jobseeker/updateProfilePhoto/',
    GetJobCategory: JobService + 'jobCategory',
    UpdateWorkExperience: jobSeekerServiceUrl + 'jobseeker/updateWorkExperience/',
    SaveWorkExperience: jobSeekerServiceUrl + 'jobseeker/addWorkExperience/',
    EditWorkExperience: jobSeekerServiceUrl + 'jobseeker/editWorkExperience/',
    DeleteWorkExperience: jobSeekerServiceUrl + 'jobseeker/deleteWorkExperience/',
    AddExperience: jobSeekerServiceUrl + 'jobseeker/addExperience/',
    GetJobsList: JobService + 'mobile/jobsearch',
    GetJobByJobId: JobService + 'mobile/jobview/',
    JobPreference: jobSeekerServiceUrl + 'jobpreference',
    GetMyJobs: JobService + 'mobile/myjobs/',
    UpdateHourlyRate: jobSeekerServiceUrl + 'jobpreference/updateRate/',
    RemoveBookMark: JobService + 'jobapplication/removeBookmark/',
    SubmitJobApplication: JobService + 'jobapplication',
    GetActiveJob: JobService + 'mobile/myjobs/activejob/',
    UploadAttendancePicture: JobService + 'fileupload/employmenthistory/',
    SaveAttendanceImgProof: JobService + 'employmentHistory/imageproof',
    MarkAttendance: JobService + 'employmentAttendance',
    GetEmployeementHistory: JobService + 'employmentHistory',
    getEmployeeAttendance: JobService + 'employmentAttendance',
    SaveRating: ratingService + 'employer',
    GetAllPaymentsRecords: jobSeekerServiceUrl + 'payment/getPaymentByJobSeeker',
    Payment: jobSeekerServiceUrl + 'payment',
    GetEarningStatus: jobSeekerServiceUrl + 'payment/earningStats/',
    SaveAccountDetails: jobSeekerServiceUrl + 'accountdetails',
    GetAccountDetails: jobSeekerServiceUrl + 'accountdetails/getByJobSeekerId/',
    UpdateAccountDetails: jobSeekerServiceUrl + 'accountdetails/updateById/',
    UploadProfilePictures: jobSeekerServiceUrl + 'fileupload/jobseeker/photo/',
    UpdateProfilePhotos: jobSeekerServiceUrl + 'jobseeker/updatePhotos/',
    UpdateIntroVideo: jobSeekerServiceUrl + 'jobseeker/updateIntroVideo',
    DeleteIntroVideo: jobSeekerServiceUrl + 'jobseeker/removeIntroVideo',
    GetDetailsByJobSeekerId: jobSeekerServiceUrl + 'jobtypepreference/getDetailByJobSeekerId/'
};
