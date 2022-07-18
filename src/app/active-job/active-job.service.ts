import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CommonProvider } from '../core/common';
import { EmploymentHistoryImageProofRequest } from '../core/modal/employment-history-request.modal';
import { Apiurl } from '../core/route';
import { ToastService } from '../services/toast.service';
import { DateTime } from 'luxon';
import { Attendance, AttendanceBody } from '../core/modal/attendance.modal';
import { Location } from '@angular/common';
import { LocationService } from '../services/location.service';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { ActiveJob } from '../core/modal/active-job.modal';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobService {
  activeJob: ActiveJob = null;
  markAttendancePicture: string = null;
  isMarkDisabled: boolean = true;
  inTime: any[] = [];
  outTime: any[] = [];
  workImages: any[] = [];
  endBeforeFifteenMin: boolean = false;
  startBeforeThirtyMin: boolean = false;
  blobData: any = null;
  enumType: any = null;
  selectedImg: string = null;
  showPaymentPage: boolean = false;
  totalPayment = null;
  selectedJobRating = 0;
  jobCompleted: boolean = false;
  checkOutPage: boolean = false;
  navigateLocation: boolean = false;
  enableLocationClick: boolean = false;

  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public location: Location,
    public locationService: LocationService,
    private launchNavigator: LaunchNavigator
  ) {
    // Location cordinates subscribe if get
    this.locationService.getLocationCordinates().subscribe(async (res) => {
      if (res) {
        await this.checkLocationCordinates();
      } else {
        this.navigateLocation = false;
      }
    })
  }

  // Get active job data from login user id
  async GetActiveJob() {
    this.activeJob = null;
    await this.commonProvider.GetMethod(Apiurl.GetActiveJob + localStorage.getItem('loginUserId'), null).then(async (res: any) => {
      this.activeJob = new ActiveJob();
      this.activeJob.job = res ? res : JSON.parse(localStorage.getItem('activeJob'));
      console.log("activeJOb-----", this.activeJob)
      if (this.activeJob?.job) {
        localStorage.setItem('activeJob', JSON.stringify(this.activeJob?.job))
        await this.checkJobIsActive();
        await this.getPaymentInfo();
        if (!this.jobCompleted) {
          await this.getActiveJobDetails();
        }
      } else {
        this.router.navigateByUrl('tabs/active-job/no-active-job')
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async checkLocationEnable() {
    this.navigateLocation = false;
    this.enableLocationClick = true;
    this.locationService.currentLocationFetch = false;
    if (this.activeJob?.job.attendanceAtVenueRequired) {
      this.locationService.currentLocationFetch = true;
      await this.locationService.requestLocationPermission();
    }
  }

  async checkLocationCordinates() {
    if (this.enableLocationClick) {
      if (this.locationService.locationCordinates && this.activeJob?.job.location) {
        this.navigateLocation = true;
      }
    }
  }

  async checkJobIsActive() {
    let activeDay = this.activeJob?.job?.dates?.filter(date => date.isActive);
    if (activeDay.length != 0) {
      this.activeJob.activeDay = activeDay[0];
      // this.activeJob.noActieJobFound = false;
    } else {
      this.activeJob.activeDay = null;
      // this.activeJob.noActieJobFound = true;
    }
  }

  async getActiveJobDetails() {
    // await this.setActiveDay();
    await this.getEmployeementAttendance();
    await this.getEmployeementHistory();
    await this.jobEndCheck();
    console.log('checkRedirection----------', this.activeJob);
  }

  // // Set Active Day
  // setActiveDay() {
  //   const jobStartDate = new Date();
  //   jobStartDate.setHours(this.activeJob.activeDay?.timeFrom[0]);
  //   jobStartDate.setMinutes(this.activeJob.activeDay?.timeFrom[1]);
  //   this.isMarkDisabled = true;
  //   for (let index = 0; index < this.activeJob.dates.length; index++) {
  //     if (this.activeJob.dates[index].isActive == true) {
  //       this.isMarkDisabled = false;
  //     }
  //   }
  // }

  //Get attendance
  async getEmployeementAttendance() {
    this.showPaymentPage = false;
    let param = "?page=0&size=5&sort=createdOn,desc" + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId') + '&' + 'employmentId=' + this.activeJob?.job.employmentId;
    return await this.commonProvider.GetMethod(Apiurl.GetEmployeementAttendance + param, null).then(async (res: any) => {
      this.activeJob.attendance = res;
      if (res) {
        res.content.forEach(att => {
          if (this.activeJob.activeDay?.date[0] == att.checkIn[0] && this.activeJob.activeDay?.date[1] == att.checkIn[1] && this.activeJob.activeDay?.date[2] == att.checkIn[2]) {
            this.inTime = this.activeJob.activeDay.timeFrom;
            this.inTime[0] = att.checkIn[3];
            this.inTime[1] = att.checkIn[4];
            this.outTime = this.activeJob.activeDay.timeTo;
            if (att.checkOut && att.checkOut.length != 0) {
              this.outTime[0] = att.checkOut[3];
              this.outTime[1] = att.checkOut[4];
            }
            if (att.totalRecordedTime) {
              this.totalPayment = (att.totalRecordedTime * this.activeJob?.job?.hourlyRate) + (localStorage.getItem('loginUserGender') == "Male" ? this.activeJob?.job?.basePrice[0] : this.activeJob?.job?.basePrice[1]);
              this.showPaymentPage = true;
            }
          }
        })
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  // Get Employeement History
  async getEmployeementHistory() {
    let param = "?page=0&size=10&sort=createdOn,desc" + '&' + 'employmentId=' + this.activeJob?.job.employmentId + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId');
    await this.commonProvider.GetMethod(Apiurl.GetEmployeementHistory + param, null).then(async (res: any) => {
      if (res) {
        res.content.forEach(hist => {
          if (this.activeJob.activeDay.date[0] == hist.historyDate[0] && this.activeJob.activeDay.date[1] == hist.historyDate[1] && this.activeJob.activeDay.date[2] == hist.historyDate[2]) {
            this.activeJob.history = hist;
            if (this.activeJob.history.imageProofs && this.activeJob.history.imageProofs.length != 0) {
              for (let index = 0; index < this.activeJob.history.imageProofs.length; index++) {
                let date = this.activeJob.history.imageProofs[index].dateTime
                let newDate: Date = new Date(date[0] + '-' + date[1] + '-' + date[2]);
                newDate.setHours(date[3])
                newDate.setMinutes(date[4])
                newDate.setSeconds(date[5])
                this.activeJob.history.imageProofs[index].uploadedDate = newDate
              }
              this.activeJob.history.imageProofs.sort(function (a, b) {
                return b.uploadedDate - a.uploadedDate;
              });
              this.workImages = this.activeJob.history.imageProofs.filter(ip => ip.proofEnum == 'MIDDLE');
            }
          }
        })
      }
      console.log(this.activeJob)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  // Get payment details
  async getPaymentInfo() {
    let param = "?page=0&size=5&sort=createdOn,desc" + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId') + '&' + 'employmentId=' + this.activeJob?.job.employmentId;
    await this.commonProvider.GetMethod(Apiurl.Payment + param, null).then(async (res: any) => {
      console.log(res)
      const activeDay = this.activeJob?.job?.dates.filter(date => date.isActive)[0];
      // this.activeJob.payment = res;
      if (res?.content.length > 0) {
        let dateFound = true;
        res?.content.forEach(async payment => {
          for (let i = 0; i < 3; i++) {
            if (payment.date[i] != activeDay.date[i]) {
              dateFound = false;
            }
          }
          if (dateFound) {
            this.toastService.showMessage('You already completed ' + this.activeJob?.job?.title + ' today.', 3000);
            this.jobCompleted = true;
            this.activeJob = null;
          } else {
          }
        });
      }
      else {
        this.jobCompleted = false;
      }
    })
  }

  async jobEndCheck() {
    await this.checkJobStartEndDate();
    console.log('checkRedirection----------', this.activeJob);
    setInterval(() => {
      this.checkJobStartEndDate();
    }, 3000);
  }

  async checkJobStartEndDate() {
    this.endBeforeFifteenMin = false;
    this.startBeforeThirtyMin = false;

    this.activeJob?.job?.dates?.forEach(dateObject => {
      let scheduledStartDate = DateTime.local(dateObject.date[0], dateObject.date[1], dateObject.date[2], dateObject.timeFrom[0], dateObject.timeFrom[1]);
      let scheduledEndDate = DateTime.local(dateObject.date[0], dateObject.date[1], dateObject.date[2], dateObject.timeTo[0], dateObject.timeTo[1]);
      scheduledStartDate.setLocale('in-IN');
      scheduledEndDate.setLocale('in-IN');
      if (!dateObject.isComplete) {
        var thirtyMinBefore: DateTime = scheduledStartDate.minus({
          hours: 0.5
        });;

        if (!this.startBeforeThirtyMin) {
          // console.log('30 min before schedule ', thirtyMinBefore.toString(), DateTime.local().toString());
          if (thirtyMinBefore.toString() < DateTime.local().toString()) {
            this.startBeforeThirtyMin = true;
          }
        }
        var fifteenMinutesBefore: DateTime = scheduledEndDate.minus({
          hours: 0.25
        });;

        if (!this.endBeforeFifteenMin) {
          // console.log('15 min schedule ', fifteenMinutesBefore.toString(), DateTime.local().toString());
          if (fifteenMinutesBefore.toString() < DateTime.local().toString()) {
            this.endBeforeFifteenMin = true;
          }
        }
      }
    })
  }

  // Mark attendance(Check-in)
  async markAttendance() {
    await this.getEmployeementAttendance();
    if (this.activeJob.attendance && this.activeJob.attendance.content?.length == 0) {
      if (this.activeJob?.job.attendanceLogInSelfieRequired) {
        this.pickImage(CameraSource.Camera, "START");
      } else {
        await this.saveMarkAttendance();
      }
    }
  }

  // After selecting img from camera and gallery
  async pickImage(source: CameraSource, enumType) {
    this.blobData = null;
    this.enumType = null;
    const image = await Camera.getPhoto({
      quality: 80,
      source,
      correctOrientation: true,
      resultType: CameraResultType.DataUrl,
    });
    this.selectedImg = image.dataUrl;
    this.blobData = this.b64toBlob(image.dataUrl.split('base64,')[1], `image/${image.format}`);
    this.enumType = enumType;
    if (this.selectedImg) {
      await this.router.navigateByUrl('upload-work-photo-view')
    }
  }

  // convert Img to blob file
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  // Generate random file name
  rendomFileName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  uploadAttendancePicture(blobData, enumType, redirectBack: boolean = false) {
    const formData = new FormData();
    let filename = "IMG-" + this.rendomFileName(5) + ".jpg";
    formData.append('image', blobData, filename);

    this.commonProvider.PostMethod(Apiurl.UploadAttendancePicture + localStorage.getItem('loginUserId'), formData).then(res => {
      this.setAttendancePicture(res);
      this.saveImage(enumType);
      if (redirectBack && !this.checkOutPage) {
        this.location.back();
      }
      if (this.checkOutPage) {
        this.goToPaymentPage();
      }
    }).catch(err => {
      console.log(err)
    })
  }

  // Save Attendance Picture
  async setAttendancePicture(data: any) {
    this.markAttendancePicture = this.commonProvider.ImagePath + data.key;
  }

  // Save Mark attendance Image
  async saveImage(enumType) {
    let param: EmploymentHistoryImageProofRequest = {
      imagePath: this.markAttendancePicture ? this.markAttendancePicture?.split('https://hour4u-img-data.s3.ap-south-1.amazonaws.com/')[1] : null,
      employmentId: this.activeJob?.job?.employmentId,
      historyDate: this.activeJob.activeDay?.date,
      jobSeekerId: localStorage.getItem('loginUserId'),
      proofEnum: enumType
    }
    await this.commonProvider.PutMethod(Apiurl.SaveAttendanceImgProof, param).then(async (res) => {
      // if(res){
      if (enumType == 'START') {
        await this.saveMarkAttendance();
        await this.getActiveJobDetails();
      } else if (enumType = 'MIDDLE') {
        await this.getActiveJobDetails();
      }
      // }
    }).catch(err => {
      console.log(err)
    })
  }

  // Final save mark attendance
  async saveMarkAttendance() {
    let param = {
      employmentId: this.activeJob?.job?.employmentId,
      jobSeekerId: localStorage.getItem('loginUserId'),
      jobSeekerName: JSON.parse(localStorage.getItem('loginUserInfo')).name,
      checkInTime: new Date()
    }
    await this.commonProvider.PostMethod(Apiurl.MarkAttendance, param).then(async (res: any) => {
      this.activeJob.attendance = res;
      // if(res){
      await this.getEmployeementHistory();
      await this.getEmployeementAttendance();
      // }
    }).catch(err => {
      console.log(err)
    })
  }

  async updateHistory() {
    const locationHistoryReq = {
      employmentId: this.activeJob?.job?.employmentId,
      historyDate: this.activeJob.activeDay.date,
      jobSeekerId: localStorage.getItem('loginUserId'),
      // latitude: this.location.latitude,
      // longitude: this.location.longitude,
    };
  }

  async checkOut() {
    this.checkOutPage = true;
    if (this.activeJob?.job.attendanceLogOutSelfieRequired) {
      this.pickImage(CameraSource.Camera, "END");
    } else {
      await this.goToPaymentPage();
    }
  }

  async goToPaymentPage() {
    console.log(this.activeJob)
    if (this.activeJob && this.activeJob?.activeDay && this.activeJob.attendance && this.activeJob.attendance.content.length != 0) {
      this.activeJob.activeDay.isComplete = true;
      const att: AttendanceBody = this.activeJob.attendance.content[0];
      var currentTime = new Date();
      var currentOffset = currentTime.getTimezoneOffset();
      var ISTOffset = 330;   // IST offset UTC +5:30 
      att.checkOutTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
      //att.checkOutTime = new Date();

      // if job already done
      if (this.activeJob.attendance.content[0].totalRecordedTime == null) {
        att.totalRecordedTime = this.getRecordedTime(DateTime.local());
      }
      await this.completeWork(att);
    } else {
      this.toastService.showMessage('You have not check-in to this job')
    }
  }

  getRecordedTime(jobEndTime: DateTime): any {
    let jobStartTime = DateTime.local(this.activeJob.activeDay.date[0],
      this.activeJob?.activeDay.date[1],
      this.activeJob?.activeDay.date[2],
      this.activeJob?.activeDay.timeFrom[0],
      this.activeJob?.activeDay.timeFrom[1]);
    jobStartTime.setLocale('in-IN')
    let attendanceDate = DateTime.local(this.activeJob.attendance?.content[0]?.checkIn[0],
      this.activeJob.attendance?.content[0]?.checkIn[1],
      this.activeJob.attendance?.content[0]?.checkIn[2],
      this.activeJob.attendance?.content[0]?.checkIn[3],
      this.activeJob.attendance?.content[0]?.checkIn[4]);
    attendanceDate.setLocale('in-IN');
    if (attendanceDate.diff(jobStartTime, 'minutes').minutes > 0) {
      return jobEndTime.diff(attendanceDate, 'hours').hours.toFixed(2);
    } else {
      return jobEndTime.diff(attendanceDate, 'hours').hours.toFixed(2);
    }
  }

  async completeWork(att) {
    await this.commonProvider.PutMethod(Apiurl.GetEmployeementAttendance + '/' + att.id, att).then(async (res: any) => {
      if (res) {
        // await this.checkJobIsActive();
        await this.getActiveJobDetails();
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async submitActiveJobRatingPayment() {
    if (this.selectedJobRating == 0) {
      this.toastService.showMessage('Rating can not be empty!');
      return;
    } else {
      let param = {
        "jobSeekerId": localStorage.getItem('loginUserId'),
        "jobSeekerName": JSON.parse(localStorage.getItem('loginUserInfo')).name,
        "employmentId": this.activeJob?.job?.employmentId,
        "employerId": this.activeJob?.job?.employmentId,
        "rating": this.selectedJobRating
      }
      await this.commonProvider.PostMethod(Apiurl.SaveRating, param).then(async (res: any) => {
        if (res) {
          this.savePayment();
        }
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

  async savePayment() {
    let param = {
      "amount": this.totalPayment,
      "date": this.activeJob.activeDay?.date,
      "employmentId": this.activeJob?.job?.employmentId,
      "jobSeekerId": localStorage.getItem('loginUserId'),
      "hours": this.activeJob?.attendance?.content[0]?.totalRecordedTime,
      "jobTitle": this.activeJob?.job?.title,
      "employmentTitle": this.activeJob?.job?.employmentTitle
    }
    await this.commonProvider.PostMethod(Apiurl.Payment, param).then(async (res: any) => {
      if (res) {
        await this.getPaymentStatus();
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async getPaymentStatus() {
    await this.commonProvider.GetMethod(Apiurl.GetEarningStatus + '/' + localStorage.getItem('loginUserId'), null).then(async (res: any) => {
      if (res) {
        await localStorage.removeItem('activeJob');
        this.activeJob = null;
        this.jobCompleted = true;
        await this.GetActiveJob();
        await this.router.navigateByUrl('tabs/my-earnings');
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async navigateToMap() {
    this.launchNavigator.navigate([this.activeJob?.job?.location.latitude, this.activeJob?.job?.location.longitude], {
      start: this.locationService.locationCordinates?.coords?.latitude + ',' + this.locationService.locationCordinates?.coords?.longitude
    });
  }
}
