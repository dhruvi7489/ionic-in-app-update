import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CommonProvider } from '../core/common';
import { EmploymentHistoryImageProofRequest } from '../core/modal/employment-history-request.modal';
import { Apiurl } from '../core/route';
import { ToastService } from '../services/toast.service';
import { PhotoUploadPage } from './photo-upload/photo-upload.page';
import { DateTime } from 'luxon';
import { Attendance } from '../core/modal/attendance.modal';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobService {
  activeJob: any = null;
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

  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public location: Location
  ) {
  }

  // Get active job data from login user id
  async GetActiveJob() {
    this.activeJob = null;
    await this.commonProvider.GetMethod(Apiurl.GetActiveJob + localStorage.getItem('loginUserId'), null).then(async (res: any) => {
      this.activeJob = res ? res : JSON.parse(localStorage.getItem('activeJob'));
      console.log("activeJOb-----", this.activeJob)
      if (this.activeJob) {
        this.activeJob.noActieJob = false;
        localStorage.setItem('activeJob', JSON.stringify(this.activeJob))
        await this.checkJobIsActive();
        await this.getPaymentInfo();
        if (!this.jobCompleted) {
          await this.getActiveJobDetails();
        }
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  async checkJobIsActive() {
    let activeDay = this.activeJob?.dates?.filter(date => date.isActive);
    if (activeDay.length != 0) {
      this.activeJob.activeDay = activeDay[0];
      this.activeJob.noActieJobFound = false;
    } else {
      this.activeJob.noActieJobFound = true;
    }
  }

  async getActiveJobDetails() {
    await this.setActiveDay();
    await this.getEmployeementAttendance();
    await this.getEmployeementHistory();
    // await this.checkRedirection();
    await this.jobEndCheck();
  }


  // async checkRedirection() {
  //   if (this.activeJob) {
  //     console.log('this.activeJob: ', this.activeJob);
  //     //console.log('this.activeJob.attendance.id: ' , this.activeJob.attendance.id);
  //     console.log(this.activeJob.attendance == null);
  //     console.log(this.activeJob.attendance == undefined);
  //     console.log(this.activeJob.attendance != null);

  //     if (this.activeJob.attendance != null) {
  //       if (this.activeJob.attendance.checkOut != null && this.activeJob.attendance.totalRecordedTime != null) {
  //         console.log('checkRedirection# /request-payment');
  //         // this.navCtrl.navigateForward('/request-payment', { queryParams: { activeJob: this.activeJob, jobSeeker: this.jobSeeker } });
  //       } else {
  //         this.activeJob.showStepperJobRunning = true;
  //       }
  //     }
  //     else if (this.activeJob.attendance == undefined || this.activeJob.attendance == null) {
  //       if (this.activeJob.attendanceAtVenueRequired) {
  //         console.log("nj04");
  //         // this.navCtrl.navigateRoot('tabs/navigate');
  //       }
  //       else {
  //         console.log("nj05");
  //         // this.navCtrl.navigateRoot('tabs/attendance');
  //       }
  //     }
  //   }
  // }

  // Set Active Day
  setActiveDay() {
    const timeNow = new Date().getTime();
    const jobStartDate = new Date();
    jobStartDate.setHours(this.activeJob.activeDay?.timeFrom[0]);
    jobStartDate.setMinutes(this.activeJob.activeDay?.timeFrom[1]);

    // const diff = (jobStartDate.getTime() - timeNow) / 1000;
    // console.log(diff, jobStartDate, timeNow)
    // if (diff <= 0) {
    //   console.log("++++++++++++++++", diff)
    //   this.activeJob.jobStarted = true;
    // }
    this.isMarkDisabled = true;
    for (let index = 0; index < this.activeJob.dates.length; index++) {
      if (this.activeJob.dates[index].isActive == true) {
        this.isMarkDisabled = false;
      }
    }
  }

  //Get attendance
  async getEmployeementAttendance() {
    this.showPaymentPage = false;
    let param = "?page=0&size=5&sort=createdOn,desc" + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId') + '&' + 'employmentId=' + this.activeJob.employmentId;
    await this.commonProvider.GetMethod(Apiurl.GetEmployeementAttendance + param, null).then(async (res: any) => {
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
              this.totalPayment = (att.totalRecordedTime * this.activeJob?.hourlyRate) + (localStorage.getItem('loginUserGender') == "Male" ? this.activeJob?.basePrice[0] : this.activeJob?.basePrice[1]);
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
    let param = "?page=0&size=10&sort=createdOn,desc" + '&' + 'employmentId=' + this.activeJob.employmentId + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId');
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
            console.log(this.workImages, "_________")
          }
        })
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }

  // Get payment details
  async getPaymentInfo() {
    let param = "?page=0&size=5&sort=createdOn,desc" + '&' + 'jobSeekerId=' + localStorage.getItem('loginUserId') + '&' + 'employmentId=' + this.activeJob.employmentId;
    await this.commonProvider.GetMethod(Apiurl.SavePayment + param, null).then(async (res: any) => {
      console.log(res)
      const activeDay = this.activeJob.dates.filter(date => date.isActive)[0];
      this.activeJob.payment = res;
      if (this.activeJob.payment.content.length > 0) {
        let dateFound = true;
        this.activeJob.payment.content.forEach(async payment => {
          for (let i = 0; i < 3; i++) {
            if (payment.date[i] != activeDay.date[i]) {
              dateFound = false;
            }
          }
          if (dateFound) {
            this.toastService.showMessage('You already completed ' + this.activeJob.title + ' today.', 3000);
            this.jobCompleted = true;
            this.activeJob = null;
          } else {
            console.log("(((((((((((((((((((((((((((((((((((")
          }
        });
      }
      else {
        this.jobCompleted = false;
      }
    })
  }

  async jobEndCheck() {
    console.log(this.activeJob)
    this.checkJobStartEndDate();
    setInterval(() => {
      this.checkJobStartEndDate();
    }, 3000);
  }

  async checkJobStartEndDate() {
    this.endBeforeFifteenMin = false;
    this.startBeforeThirtyMin = false;

    this.activeJob?.dates?.forEach(dateObject => {
      console.log("dateObject", dateObject)
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
            // console.log("$$$$$$$$$$$$$$$$$$$$$")
            this.startBeforeThirtyMin = true;
          }
        }
        var fifteenMinutesBefore: DateTime = scheduledEndDate.minus({
          hours: 0.25
        });;

        if (!this.endBeforeFifteenMin) {
          console.log('15 min schedule ', fifteenMinutesBefore.toString(), DateTime.local().toString());
          if (fifteenMinutesBefore.toString() < DateTime.local().toString()) {
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            this.endBeforeFifteenMin = true;
          }
        }
      }
    })
  }

  // Mark attendance(Check-in)
  async markAttendance() {
    await this.getEmployeementAttendance();
    console.log(this.activeJob)
    console.log(this.activeJob.attendance)
    if (this.activeJob.attendance && this.activeJob.attendance.content.length == 0) {
      if (this.activeJob.attendanceLogInSelfieRequired) {
        //   let obj = {
        //     title: "Mark Your Attendance",
        //     message: "Make sure you upload a photo with background of banner",
        //     okBtnText: "Lets go",
        //     cancelBtnText: "",
        //     img: "../../assets/imgs/Iconsax/Svg/All/outline/avatar_vector.svg"
        //   }
        //   const modal = await this.modalCtrl.create({
        //     component: PhotoUploadPage,
        //     componentProps: obj
        //   });
        //   await modal.present();
        this.pickImage(CameraSource.Camera, "START");
      } else {
        await this.saveMarkAttendance();
      }
    }
  }

  // Upload Attendance picture options
  async openLoginSelfiePictureUploadOptions() {
    // const actionSheet = await this.actionSheetController.create({
    //   header: 'Select Image source',
    //   buttons: [
    //     {
    //       text: 'Use Camera',
    //       handler: () => {
    //         this.pickImage(CameraSource.Camera);
    //       }
    //     },
    //     {
    //       text: 'Load from Library',
    //       handler: () => {
    //         this.pickImage(CameraSource.Photos);
    //       }
    //     },
    //     {
    //       text: 'Cancel',
    //       role: 'cancel'
    //     }
    //   ]
    // });
    // await actionSheet.present();
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
    console.log(this.selectedImg)
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
      if (redirectBack) {
        this.location.back();
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
      employmentId: this.activeJob.employmentId,
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
      employmentId: this.activeJob.employmentId,
      jobSeekerId: localStorage.getItem('loginUserId'),
      jobSeekerName: JSON.parse(localStorage.getItem('loginUserInfo')).name,
      checkInTime: new Date()
    }
    await this.commonProvider.PostMethod(Apiurl.MarkAttendance, param).then(async (res) => {
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
      employmentId: this.activeJob.employmentId,
      historyDate: this.activeJob.activeDay.date,
      jobSeekerId: localStorage.getItem('loginUserId'),
      // latitude: this.location.latitude,
      // longitude: this.location.longitude,
    };
  }

  async checkOut() {
    console.log(this.activeJob)
    this.activeJob.activeDay.isComplete = true;
    const att: Attendance = this.activeJob.attendance.content[0];
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    att.checkOutTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    //att.checkOutTime = new Date();

    // if job already done
    if (this.activeJob.attendance.content[0].totalRecordedTime == null) {
      att.totalRecordedTime = this.getRecordedTime(DateTime.local());
      console.log("att.totalRecordedTime", att.totalRecordedTime)
    }

    await this.completeWork(att);
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
        await this.checkJobIsActive();
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
        "employmentId": this.activeJob.employmentId,
        "employerId": this.activeJob.employmentId,
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
      "employmentId": this.activeJob?.employmentId,
      "jobSeekerId": localStorage.getItem('loginUserId'),
      "hours": this.activeJob?.attendance?.content[0]?.totalRecordedTime,
      "jobTitle": this.activeJob?.title,
      "employmentTitle": this.activeJob?.employmentTitle
    }
    await this.commonProvider.PostMethod(Apiurl.SavePayment, param).then(async (res: any) => {
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
        await this.router.navigateByUrl('tabs/tab3');
      }
    }).catch((err: any) => {
      console.log(err)
    })
  }
}
