import { Injectable, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CommonProvider } from '../core/common';
import { EmploymentHistoryImageProofRequest } from '../core/modal/employment-history-request.modal';
import { Apiurl } from '../core/route';
import { ToastService } from '../core/services/toast.service';
import { DateTime } from 'luxon';
import { Attendance, AttendanceBody } from '../core/modal/attendance.modal';
import { Location } from '@angular/common';
import { LocationService } from '../core/services/location.service';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { ActiveJob } from '../core/modal/active-job.modal';
import { LoadingService } from '../core/services/loading.service';
import { JobRating } from '../core/modal/job-rating.model';
import { Payment } from '../core/modal/payment.modal';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { JobUtilervice } from '../core/util/job-util.service';
import { Address } from '../core/modal/address.modal';
import { Capacitor } from '@capacitor/core';
declare var google;

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
  endAfterTwoHours: boolean = false;
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
  workPictureDescription: string = null;
  maxlengthworkPictureDescription = 200;
  leftworkPictureDescriptionCharacters = 0;

  expectedAmount: number;
  reasonForExpectedAmount: string = null;
  maxlengthReasonForExpectedAmount = 200;
  leftCharactersForExpectedAmount = 0;

  jobRatingDescription: string = null;
  maxlengthjobRatingDescription = 200;
  leftCharactersForjobRatingDescription = 0;
  isJobCompletedTimeGone: boolean = false;
  timeout: any = null;

  dayChange: boolean = false;
  newDayDate: any[] = [];

  addressObj: Address = {
    address: null,
    city: null,
    country: null,
    latitude: null,
    longitude: null,
    placeId: null,
    region: null,
    zip: null,
    distance: null
  };
  locationCheckClick: boolean = false;

  constructor(
    public commonProvider: CommonProvider,
    public router: Router,
    public toastService: ToastService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    public location: Location,
    public locationService: LocationService,
    private launchNavigator: LaunchNavigator,
    public loadingService: LoadingService,
    public storage: Storage,
    public jobUtilService: JobUtilervice,
    public cdr: ApplicationRef
  ) {
    // Location cordinates subscribe if get
    this.locationService.getLocationCordinates().subscribe(async (res) => {
      if (res) {
        // this.locationCheckClick = false;
        await this.checkLocationCordinates();
        if (this.locationCheckClick) {
          await this.getAddress(res?.coords?.latitude, res?.coords?.longitude);
        }
      } else {
        this.navigateLocation = false;
      }
    })
  }

  // Get active job data from login user id
  async GetActiveJob() {
    this.loadingService.show();
    this.activeJob = null;
    const loginUserId = await this.storage.get('loginUserId');
    const activeJob = await this.storage.get('activeJob');

    this.commonProvider.GetMethod(Apiurl.GetActiveJob + loginUserId, null).then(async (res: any) => {
      this.loadingService.dismiss();
      this.activeJob = new ActiveJob();
      this.activeJob.job = res ? res : JSON.parse(activeJob);
      if (this.activeJob?.job) {
        this.storage.set('activeJob', JSON.stringify(this.activeJob?.job))

        await this.checkIncheckOutDateTimeCalculation();
        await this.checkJobIsActive();
        await this.getPaymentInfo();
        if (!this.jobCompleted) {
          await this.getActiveJobDetails();
        } else {
          this.checkRedirection();
        }
      } else {
        this.router.navigateByUrl('tabs/active-job/no-active-job')
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // check if job is active
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

  // Location enable check
  async checkLocationEnable() {
    this.navigateLocation = false;
    this.enableLocationClick = true;
    this.locationService.currentLocationFetch = false;
    if (this.activeJob?.job.attendanceAtVenueRequired) {
      this.locationService.currentLocationFetch = true;
      if (!this.locationService.locationPermissionGranted) {
        await this.locationService.requestLocationPermission();
      }
    }
  }

  // Location cordinates get
  async checkLocationCordinates() {
    // if (this.enableLocationClick) {
    if (this.locationService.locationCordinates && this.activeJob?.job.location) {
      this.navigateLocation = true;
    }
    // }
  }

  // Attendance , history, job end all things check
  async getActiveJobDetails() {
    await this.getEmployeeAttendance();
    await this.getEmployeementHistory();
    await this.jobEndCheck();
    await this.checkRedirection();
  }

  // Redirection of pages based on condition
  checkRedirection() {
    this.checkLocationCordinates();
    if (this.activeJob && this.activeJob?.job && !this.jobCompleted) {
      // if (this.activeJob?.job?.attendanceAtVenueRequired && !this?.endBeforeFifteenMin) {
      if (this.activeJob?.job?.attendanceAtVenueRequired && !this?.endAfterTwoHours) {
        clearTimeout(this.timeout);
        var $this = this;
        this.timeout = setTimeout(function () {
          $this.locationService.getCurrentLocationPosition(true);
        }, 1000)
        let dis = this.calculateDistance(this.activeJob?.job?.location.latitude, this.locationService.locationCordinates?.coords?.latitude,
          this.activeJob?.job?.location.longitude, this.locationService.locationCordinates?.coords?.longitude);
        if (this.locationService.locationCordinates && this.activeJob?.job.location) {
          this.navigateLocation = true;
        }
        if (!isNaN(dis) && dis > 100) {
          this.router.navigateByUrl('tabs/active-job/active-job-location');
        } else {
          if (!isNaN(dis)) {
            // if (this.inTime.length != 0 && this.endBeforeFifteenMin && !this.showPaymentPage && !this.jobCompleted) {
            if (this.inTime.length != 0 && this.endAfterTwoHours && !this.showPaymentPage && !this.jobCompleted) {
              this.router.navigateByUrl('tabs/active-job/active-job-end');
            }
            if (this.showPaymentPage && !this.jobCompleted) {
              this.router.navigateByUrl('tabs/active-job/active-job-summary');
            }
            else if (!this.jobCompleted) {
              this.router.navigateByUrl('tabs/active-job/active-job-mark-attendance');
            }
          } else {
            this.router.navigateByUrl('tabs/active-job/active-job-location');
          }
        }
      } else {
        // if (!this.endBeforeFifteenMin) {
        if (!this.endAfterTwoHours) {
          if (!this.isJobCompletedTimeGone) {
            this.router.navigateByUrl('tabs/active-job/active-job-mark-attendance');
          } else {
            this.router.navigateByUrl('tabs/active-job/active-job-end');
          }
        } else {
          if (this.inTime.length == 0) {
            this.toastService.showMessage(`You job is ending within 15 min , Now you can't able to login.`)
            this.router.navigateByUrl('tabs/active-job/no-active-job');
          } else {
            this.router.navigateByUrl('tabs/active-job/active-job-end');
          }
        }
      }

      // if (this.inTime.length != 0 && this.endBeforeFifteenMin && !this.showPaymentPage && !this.jobCompleted) {
      if (this.inTime.length != 0 && this.endAfterTwoHours && !this.showPaymentPage && !this.jobCompleted) {
        this.router.navigateByUrl('tabs/active-job/active-job-end');
      }

      // if (this.inTime.length == 0 && this.endBeforeFifteenMin && !this.showPaymentPage && !this.jobCompleted) {
      if (this.inTime.length == 0 && this.endAfterTwoHours && !this.showPaymentPage && !this.jobCompleted) {
        this.toastService.showMessage(`You job is ending within 15 min , Now you can't able to login.`)
        this.router.navigateByUrl('tabs/active-job/no-active-job');
      }

      if (this.showPaymentPage) {
        this.router.navigateByUrl('tabs/active-job/active-job-summary');
      }
    } else {
      this.router.navigateByUrl('tabs/active-job/no-active-job');
    }
  }

  //Get attendance
  async getEmployeeAttendance() {
    this.showPaymentPage = false;
    this.inTime = [];
    this.outTime = [];
    const loginUserId = await this.storage.get('loginUserId');
    const loginUserGender = await this.storage.get('loginUserGender');
    let param = "?page=0&size=5&sort=createdOn,desc" + '&' + 'jobSeekerId=' + loginUserId + '&' + 'employmentId=' + this.activeJob?.job?.employmentId;
    this.commonProvider.GetMethod(Apiurl.getEmployeeAttendance + param, null).then(async (res: any) => {
      if (this.activeJob) {
        this.activeJob.attendance = res;
        if (res) {
          res.content.forEach(async (att) => {
            if (this.activeJob.activeDay?.date[0] == att.checkIn[0] && this.activeJob.activeDay?.date[1] == att.checkIn[1] && this.activeJob.activeDay?.date[2] == att.checkIn[2]) {

              this.inTime = Object.assign(this.inTime, this.activeJob.activeDay.timeFrom);
              this.inTime[0] = att.checkIn[3];
              this.inTime[1] = att.checkIn[4];
              let checkInDate: DateTime = DateTime.local(att.checkIn[0], att.checkIn[1], att.checkIn[2], att.checkIn[3], att.checkIn[4]);
              checkInDate.setLocale('in-IN');

              this.outTime = Object.assign(this.outTime, []);
              if (att.checkOut && att.checkOut.length != 0) {
                let checkOutDate: DateTime = DateTime.local(att.checkOut[0], att.checkOut[1], att.checkOut[2], att.checkOut[3], att.checkOut[4]);
                checkOutDate.setLocale('in-IN');
                this.outTime[0] = att.checkOut[3];
                this.outTime[1] = att.checkOut[4];
              }
              this.cdr.tick();
              if (att.totalRecordedTime) {
                if (this.activeJob?.job?.basePrice) {
                  this.totalPayment = (att.totalRecordedTime * this.activeJob?.job?.hourlyRate) + (loginUserGender == "Male" ? this.activeJob?.job?.basePrice[0] : this.activeJob?.job?.basePrice[1]);
                }
                this.showPaymentPage = true;
              }
            }
          })
        }
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Get Employeement History
  async getEmployeementHistory() {
    const loginUserId = await this.storage.get('loginUserId');
    let param = "?page=0&size=10&sort=createdOn,desc" + '&' + 'employmentId=' + this.activeJob?.job.employmentId + '&' + 'jobSeekerId=' + loginUserId;
    this.commonProvider.GetMethod(Apiurl.GetEmployeementHistory + param, null).then(async (res: any) => {
      if (res) {
        res.content.forEach(hist => {
          if (this.activeJob.activeDay.date[0] == hist.historyDate[0] && this.activeJob.activeDay.date[1] == hist.historyDate[1] && this.activeJob.activeDay.date[2] == hist.historyDate[2]) {
            this.activeJob.history = hist;
            if (this.activeJob.history.imageProofs && this.activeJob.history.imageProofs.length != 0) {
              for (let index = 0; index < this.activeJob.history.imageProofs.length; index++) {
                let date = this.activeJob.history.imageProofs[index].dateTime
                let newDate: Date = new Date(date[0], date[1] - 1, date[2]);
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
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Get payment details if payment completed or not
  async getPaymentInfo() {
    const loginUserId = await this.storage.get('loginUserId');
    let param = "?page=0&size=5&sort=createdOn,desc" + '&' + 'jobSeekerId=' + loginUserId + '&' + 'employmentId=' + this.activeJob?.job.employmentId;
    this.commonProvider.GetMethod(Apiurl.Payment + param, null).then(async (res: any) => {
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
            // this.toastService.showMessage('You already completed ' + this.activeJob?.job?.title + ' today.', 3000);
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

  // Job start & end check by timeinterval
  async jobEndCheck() {
    await this.checkJobStartEndDate();
    this.endAfterTwoHours = false;
    this.endBeforeFifteenMin = false;
    this.startBeforeThirtyMin = false;
    setInterval(() => {
      // if (!this.endBeforeFifteenMin || !this.startBeforeThirtyMin) {
      if (!this.endAfterTwoHours || !this.startBeforeThirtyMin) {
        this.checkJobStartEndDate();
      }
    }, 500);
  }

  async checkJobStartEndDate() {
    let checkInDate: DateTime = null;
    if (this.activeJob && this.activeJob.attendance) {
      this.activeJob?.attendance?.content?.forEach(async (att) => {
        checkInDate = DateTime.local(att.checkIn[0], att.checkIn[1], att.checkIn[2], att.checkIn[3], att.checkIn[4]);
        checkInDate.setLocale('in-IN');
      })
    } else {
      if (this.activeJob) {
        await this.getEmployeeAttendance();
        await this.activeJob?.attendance?.content?.forEach(async (att) => {
          checkInDate = DateTime.local(att.checkIn[0], att.checkIn[1], att.checkIn[2], att.checkIn[3], att.checkIn[4]);
          checkInDate.setLocale('in-IN');
        })
      }
    }
    this.activeJob?.job?.dates?.forEach(dateObject => {
      let scheduledStartDate: DateTime = DateTime.local(dateObject.date[0], dateObject.date[1], dateObject.date[2], dateObject.timeFrom[0], dateObject.timeFrom[1]);
      let scheduledEndDate: DateTime = DateTime.local(dateObject.date[0], dateObject.date[1], dateObject.date[2], dateObject.timeTo[0], dateObject.timeTo[1]);
      scheduledStartDate.setLocale('in-IN');
      scheduledEndDate.setLocale('in-IN');

      if (scheduledStartDate.toString() > scheduledEndDate.toString()) {
        scheduledEndDate = DateTime.local(dateObject.date[0], dateObject.date[1], this.jobUtilService.addDaysInDate(dateObject.date, 1), dateObject.timeTo[0], dateObject.timeTo[1]);
      }

      if (!dateObject.isComplete) {
        // Job start before 30 min
        var thirtyMinBefore: DateTime = scheduledStartDate.minus({
          hours: 0.5
        });

        if (!this.startBeforeThirtyMin) {
          // console.log('30 min before schedule ', thirtyMinBefore.toString(), DateTime.local().toString());
          if (thirtyMinBefore.toString() < DateTime.local().toString()) {
            this.startBeforeThirtyMin = true;
            this.checkRedirection()
          }
        }

        // Job end before 15 min
        var fifteenMinutesBefore: DateTime = scheduledEndDate.minus({
          hours: 0.25
        });

        // if (!this.endBeforeFifteenMin) {
        //   // console.log('15 min schedule ', fifteenMinutesBefore.toString(), DateTime.local().toString());
        //   if (fifteenMinutesBefore.toString() < DateTime.local().toString()) {
        //     if (scheduledEndDate.toString() > DateTime.local().toString()) {
        //       this.endBeforeFifteenMin = true;
        //       this.checkRedirection();
        //     }
        //   }
        // }
        if (checkInDate) {
          // Job end after 2 hours of check-in
          var twoHoursAfter: DateTime = checkInDate.plus({
            hours: 2
          });
          if (!this.endAfterTwoHours && checkInDate) {
            // if (twoHoursAfter.toString() < DateTime.local().toString()) {
            if (checkInDate.toString() <= twoHoursAfter.toString()) {
              if (twoHoursAfter.toString() < DateTime.local().toString()) {
                this.endAfterTwoHours = true;
                this.checkRedirection();
              }
            }
            // }
          }
        }

        if (scheduledEndDate.toString() < DateTime.local().toString()) {
          this.isJobCompletedTimeGone = true;
        }

        if (scheduledStartDate.toString() < scheduledEndDate.toString()) {
          if (scheduledEndDate.toString() < DateTime.local().toString()) {
            this.isJobCompletedTimeGone = true;
          }
        }
      }
    })
  }

  // Mark attendance(Check-in)
  async markAttendance() {
    await this.getEmployeeAttendance();
    if (this.addressObj?.latitude && this.addressObj?.longitude) {
      if (this.activeJob.attendance && this.activeJob.attendance.content?.length == 0) {
        if (this.activeJob?.job.attendanceLogInSelfieRequired) {
          this.pickImage(CameraSource.Camera, "START");
        } else {
          await this.saveMarkAttendanceWithLocationInfo();
        }
      }
    } else {
      await this.saveMarkAttendance();
    }
  }

  // Upload profile picture options
  async uploadProfilePicture(enumType) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.pickImage(CameraSource.Camera, enumType);
          }
        },
        {
          text: 'Load from Library',
          handler: () => {
            this.pickImage(CameraSource.Photos, enumType);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // After selecting img from camera and gallery
  async pickImage(source: CameraSource, enumType) {
    this.blobData = null;
    this.enumType = null;
    const image = await Camera.getPhoto({
      quality: 80,
      height: 700,
      width: 700,
      source,
      correctOrientation: true,
      resultType: CameraResultType.DataUrl,
    });
    this.selectedImg = image.dataUrl;
    this.blobData = this.b64toBlob(image.dataUrl.split('base64,')[1], `image/${image.format}`);
    this.enumType = enumType;
    console.log("this.selectedImg", this.selectedImg);
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

  // Upload attendance picture
  async uploadAttendancePicture(blobData, enumType, redirectBack: boolean = false) {
    this.loadingService.show();
    const loginUserId = await this.storage.get('loginUserId');
    const formData = new FormData();
    let filename = "IMG-" + this.rendomFileName(5) + ".jpg";
    formData.append('image', blobData, filename);

    this.commonProvider.PostMethod(Apiurl.UploadAttendancePicture + loginUserId, formData).then(async (res) => {
      this.loadingService.dismiss();
      this.setAttendancePicture(res);
      this.saveImage(enumType);
      if (redirectBack && !this.checkOutPage) {
        this.location.back();
      }
      if (this.checkOutPage) {
        await this.goToPaymentPage();
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Save Attendance Picture
  async setAttendancePicture(data: any) {
    this.markAttendancePicture = this.commonProvider.ImagePath + data.key;
  }

  // Save Mark attendance Image
  async saveImage(enumType) {
    const loginUserId = await this.storage.get('loginUserId');
    let param: EmploymentHistoryImageProofRequest = {
      imagePath: this.markAttendancePicture ? this.markAttendancePicture?.split('https://hour4u-img-data.s3.ap-south-1.amazonaws.com/')[1] : null,
      employmentId: this.activeJob?.job?.employmentId,
      historyDate: this.activeJob.activeDay?.date,
      jobSeekerId: loginUserId,
      proofEnum: enumType,
      description: this.workPictureDescription
    }
    this.commonProvider.PutMethod(Apiurl.SaveAttendanceImgProof, param).then(async (res) => {
      if (res) {
        if (enumType == 'START') {
          await this.saveMarkAttendanceWithLocationInfo();
          await this.getActiveJobDetails();
        } else if (enumType = 'MIDDLE') {
          await this.getActiveJobDetails();
        }
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Get city, country, zip from latitude, longitude
  async getAddress(latitude, longitude) {
    this.addressObj = new Address();
    this.addressObj.latitude = latitude;
    this.addressObj.longitude = longitude;
    const geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, async (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.addressObj.address = results[0].formatted_address;
          this.addressObj.placeId = results[0].place_id;
          for (let i = 0; i < results[0].address_components.length; i++) {
            if (results[0].address_components[i].types[0] === 'locality') {
              this.addressObj.city = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] === 'administrative_area_level_1') {
              this.addressObj.region = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] === 'country') {
              this.addressObj.country = results[0].address_components[i].long_name;
            }
            if (results[0].address_components[i].types[0] === 'postal_code') {
              this.addressObj.zip = results[0].address_components[i].long_name;
            }
          }
        } else {
          this.toastService.showMessage('No results found', 2000);
        }
      } else {
        this.toastService.showMessage('Google maps location failed due to: ' + status, 2000);
      }
      if (this.addressObj.latitude && this.addressObj.longitude) {
        if (this.locationCheckClick) {
          if (this.activeJob?.job.attendanceLogInSelfieRequired) {
            this.pickImage(CameraSource.Camera, "START");
          }
          else {
            this.saveMarkAttendanceWithLocationInfo();
          }
        }
      }
    });
  }


  // Get user heck in location before mark attendance
  async saveMarkAttendance() {
    this.locationCheckClick = true;
    if (Capacitor.getPlatform() !== 'web') {
      if (!this.locationService.locationPermissionGranted) {
        await this.locationService.requestLocationPermission(true);
      } else {
        if (this.locationService.locationCordinates) {
          await this.getAddress(this.locationService.locationCordinates?.coords?.latitude, this.locationService.locationCordinates?.coords?.longitude);
        } else {
          await this.locationService.requestLocationPermission(true);
          await this.getAddress(this.locationService.locationCordinates?.coords?.latitude, this.locationService.locationCordinates?.coords?.longitude);
        }
      }
    } else {
      await this.locationService.fetchLocationFromWebPermisssion();
      await this.getAddress(this.locationService.locationCordinates?.coords?.latitude, this.locationService.locationCordinates?.coords?.longitude);
    }
  }


  // Final save mark attendance with location address
  async saveMarkAttendanceWithLocationInfo() {
    const loginUserId = await this.storage.get('loginUserId');
    const loginUserInfo = await this.storage.get('loginUserInfo');
    this.loadingService.show();
    if (this.addressObj.latitude && this.addressObj.longitude) {
      let param: AttendanceBody = {
        employmentId: this.activeJob?.job?.employmentId,
        jobSeekerId: loginUserId,
        jobSeekerName: JSON.parse(loginUserInfo)?.name,
        checkInTime: new Date(),
        address: this.addressObj,
      }
      console.log("Mark attendance", param)
      this.commonProvider.PostMethod(Apiurl.MarkAttendance, param).then(async (res: any) => {
        this.loadingService.dismiss();
        this.activeJob.attendance = res;
        // if(res){
        await this.getEmployeementHistory();
        await this.getEmployeeAttendance();
        await this.locationService.clearWatch();
        // }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    }
  }
  // async updateHistory() {
  //   const locationHistoryReq = {
  //     employmentId: this.activeJob?.job?.employmentId,
  //     historyDate: this.activeJob.activeDay.date,
  //     jobSeekerId: this.storage.get('loginUserId'),
  //     // latitude: this.location.latitude,
  //     // longitude: this.location.longitude,
  //   };
  // }

  // checkout
  async checkOut() {
    this.checkOutPage = true;
    if (this.activeJob?.job.attendanceLogOutSelfieRequired) {
      this.pickImage(CameraSource.Camera, "END");
    } else {
      await this.goToPaymentPage();
    }
  }

  // Payment page redirction
  async goToPaymentPage() {
    if (this.activeJob && this.activeJob?.activeDay && this.activeJob.attendance && this.activeJob.attendance.content.length != 0) {
      this.activeJob.activeDay.isComplete = true;
      const att: AttendanceBody = this.activeJob.attendance.content[0];
      var currentTime = new Date();
      var currentOffset = currentTime.getTimezoneOffset();
      var ISTOffset = 330;   // IST offset UTC +5:30 
      let scheduledEndDate: DateTime = DateTime.local(this.activeJob?.activeDay?.date[0], this.activeJob?.activeDay?.date[1],
        this.activeJob?.activeDay?.date[2], this.activeJob?.activeDay?.timeTo[0], this.activeJob?.activeDay?.timeTo[1]);
      let scheduledStartDate: DateTime = DateTime.local(this.activeJob?.activeDay?.date[0], this.activeJob?.activeDay?.date[1],
        this.activeJob?.activeDay?.date[2], this.activeJob?.activeDay?.timeFrom[0], this.activeJob?.activeDay?.timeFrom[1]);

      // If end-time is more than job end-time
      let checkOutTimeBasedOnTimeTo = new Date(scheduledEndDate + (ISTOffset + currentOffset) * 60000);

      // If end-time is less than the job end-time
      let checkOutTimeBasedOnCurrentTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
      let isDayChange = this.jobUtilService.shiftDayChange(this.activeJob?.activeDay.date, this.activeJob?.activeDay.timeFrom, this.activeJob?.activeDay.timeTo);
      const hours = this.jobUtilService.hoursOfJob(this.activeJob?.activeDay.date, this.activeJob?.activeDay.timeFrom, this.activeJob?.activeDay.timeTo);

      if (!isDayChange) { // If day not change
        if (checkOutTimeBasedOnTimeTo > checkOutTimeBasedOnCurrentTime) { // If end-time is less than the job end-time
          att.checkOutTime = checkOutTimeBasedOnCurrentTime;
          if (this.activeJob.attendance.content[0].totalRecordedTime == null) {
            att.totalRecordedTime = this.getRecordedTime(DateTime.local());
          }
          // return;
          await this.completeWork(att);
        } else { // If end-time is more than job end-time
          att.checkOutTime = checkOutTimeBasedOnTimeTo;
          if (this.activeJob.attendance.content[0].totalRecordedTime == null) {
            att.totalRecordedTime = this.getRecordedTime(scheduledEndDate);
            if (att.totalRecordedTime < 0) {
              att.totalRecordedTime = Number(att.totalRecordedTime) + 24
            }
          }
          // return;
          await this.completeWork(att);
        }
      } else { // If day change
        let dateEndObject: any[] = [];
        dateEndObject = Object.assign(dateEndObject, this.activeJob?.activeDay.date);
        if (scheduledStartDate.toString() > scheduledEndDate.toString()) {
          dateEndObject[2] = this.jobUtilService.addDaysInDate(this.activeJob?.activeDay.date, 1)
        }
        let jobEndDate = new Date(dateEndObject[0], dateEndObject[1] - 1, dateEndObject[2]);
        jobEndDate.setHours(this.activeJob?.activeDay.timeTo[0]);
        jobEndDate.setMinutes(this.activeJob?.activeDay.timeTo[1]);

        if (jobEndDate > checkOutTimeBasedOnCurrentTime) {
          att.checkOutTime = checkOutTimeBasedOnCurrentTime;
          if (this.activeJob.attendance.content[0].totalRecordedTime == null) {
            att.totalRecordedTime = this.getRecordedTime(DateTime.local());
          }
          // return;
          await this.completeWork(att);
        } else {
          att.checkOutTime = jobEndDate;
          if (this.activeJob.attendance.content[0].totalRecordedTime == null) {
            att.totalRecordedTime = this.getRecordedTime(scheduledEndDate);
            if (att.totalRecordedTime < 0) {
              att.totalRecordedTime = Number(att.totalRecordedTime) + 24
            }
          }
          // return;
          await this.completeWork(att);
        }
      }
    } else {
      this.toastService.showMessage('You have not check-in to this job!')
    }
  }

  //Get total job recorded time
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

  // complete the job
  async completeWork(att) {
    this.commonProvider.PutMethod(Apiurl.getEmployeeAttendance + '/' + att.id, att).then(async (res: any) => {
      if (res) {
        await this.getActiveJobDetails();
      }
    }).catch((err: HttpErrorResponse) => {
      console.log(err);
    })
  }

  // Job rating save
  async submitActiveJobRatingPayment() {
    await this.loadingService.show();
    const loginUserId = await this.storage.get('loginUserId');
    const loginUserInfo = await this.storage.get('loginUserInfo');
    if (this.selectedJobRating == 0) {
      await this.loadingService.dismiss();
      await this.toastService.showMessage('Rating can not be empty!');
      return;
    } else {
      let param: JobRating = {
        "jobSeekerId": loginUserId,
        "jobSeekerName": JSON.parse(loginUserInfo)?.name,
        "employmentId": this.activeJob?.job?.employmentId,
        "employerId": this.activeJob?.job?.employmentId,
        "rating": this.selectedJobRating
      }
      this.commonProvider.PostMethod(Apiurl.SaveRating, param).then(async (res: any) => {
        await this.loadingService.dismiss();
        if (res) {
          this.savePayment();
        }
      }).catch((err: HttpErrorResponse) => {
        this.loadingService.dismiss();
        console.log(err);
      })
    }
  }

  // Save Job payment
  async savePayment() {
    await this.loadingService.show();
    const loginUserId = await this.storage.get('loginUserId');
    let param: Payment = {
      "amount": this.totalPayment,
      "date": this.activeJob.activeDay?.date,
      "employmentId": this.activeJob?.job?.employmentId,
      "jobSeekerId": loginUserId,
      "hours": this.activeJob?.attendance?.content[0]?.totalRecordedTime,
      "jobTitle": this.activeJob?.job?.title,
      "employmentTitle": this.activeJob?.job?.employmentTitle,
      "expectedAmount": this.expectedAmount,
      "reasonForExpectedAmount": this.reasonForExpectedAmount,
      "feedback": this.jobRatingDescription
    }
    this.commonProvider.PostMethod(Apiurl.Payment, param).then(async (res: any) => {
      await this.loadingService.dismiss();
      if (res) {
        await this.resetActiveJobData();
        await this.getPaymentStatus();
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Get job payment status
  async getPaymentStatus() {
    const loginUserId = await this.storage.get('loginUserId');
    this.loadingService.show();
    this.commonProvider.GetMethod(Apiurl.GetEarningStatus + loginUserId, null).then(async (res: any) => {
      this.loadingService.dismiss();
      if (res) {
        this.activeJob = null;
        this.jobCompleted = true;
        await this.GetActiveJob();
        await this.router.navigateByUrl('tabs/my-earnings');
      }
    }).catch((err: HttpErrorResponse) => {
      this.loadingService.dismiss();
      console.log(err);
    })
  }

  // Open location in google map
  async navigateToMap() {
    this.launchNavigator.navigate([this.activeJob?.job?.location.latitude, this.activeJob?.job?.location.longitude], {
      start: this.locationService.locationCordinates?.coords?.latitude + ',' + this.locationService.locationCordinates?.coords?.longitude
    });
  }

  calculateDistance(lat1: number, lat2: number, long1: number, long2: number) {
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }

  resetActiveJobData() {
    this.storage.remove('activeJob');
    // localStorage.removeItem('activeJob');
    this.activeJob = null;
    this.inTime = [];
    this.outTime = [];
    this.workImages = [];
    this.enableLocationClick = false;
    this.blobData = null;
    this.checkOutPage = false;
    this.workPictureDescription = null;
    this.totalPayment = 0;
    this.startBeforeThirtyMin = false;
    this.endBeforeFifteenMin = false;
    this.endAfterTwoHours = false;
    this.showPaymentPage = false;
    this.selectedJobRating = 0;
    this.selectedImg = null;
    this.jobCompleted = false;
    this.navigateLocation = false;
    this.enableLocationClick = false;
    this.workPictureDescription = null;
    this.maxlengthworkPictureDescription = 200;
    this.leftworkPictureDescriptionCharacters = 0;
    this.expectedAmount = null;
    this.reasonForExpectedAmount = null;
    this.maxlengthReasonForExpectedAmount = 200;
    this.leftCharactersForExpectedAmount = 0;
    this.jobRatingDescription = null;
    this.maxlengthjobRatingDescription = 200;
    this.leftCharactersForjobRatingDescription = 0;
    this.isJobCompletedTimeGone = false;
  }

  // CheckIn-checkOut Date-Time Calculation
  checkIncheckOutDateTimeCalculation() {
    this.activeJob?.job?.dates?.forEach(dateObject => {
      let scheduledStartDate: DateTime = DateTime.local(dateObject.date[0], dateObject.date[1], dateObject.date[2], dateObject.timeFrom[0], dateObject.timeFrom[1]);
      let scheduledEndDate: DateTime = DateTime.local(dateObject.date[0], dateObject.date[1], dateObject.date[2], dateObject.timeTo[0], dateObject.timeTo[1]);
      scheduledStartDate.setLocale('in-IN');
      scheduledEndDate.setLocale('in-IN');
      this.dayChange = false;
      if (scheduledStartDate.toString() > scheduledEndDate.toString()) {
        this.newDayDate[0] = dateObject.date[0];
        this.newDayDate[1] = dateObject.date[1];
        this.newDayDate[2] = this.jobUtilService.addDaysInDate(dateObject?.date, 1);
        this.dayChange = true;
      }
    })
  }
}
