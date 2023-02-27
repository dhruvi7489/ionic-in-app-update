import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { EmploymentDate } from '../modal/employment.modal';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class JobUtilervice {
  constructor() { }
  dayChange: boolean = false;
  newDayDate: any[] = [];

  distanceBetweenLatLong(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      // if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  travelTimeFromDistance(distance: any) {
    let time = (parseFloat(distance) * 6);

    if ((time / 60) <= 1) {
      return Math.floor(time) + ' mins';
    } else {
      return Math.floor(time / 60) + ' hrs';
    }

  }

  arrayToDate(arr: any) {
    return new Date(arr[0], arr[1], arr[2]);
  }

  arrayToDate2(arr: any, time: any) {
    // new Date("2020-04-13T00:00:00.000+08:00");
    var mydate = new Date("" + arr[0] + "-" + arr[1] + "-" + arr[2] + "T00:00:00.000+05:30");
    // mydate.setFullYear(arr[0]);
    // mydate.setMonth(arr[1]);
    // mydate.setDate(arr[2]);
    // mydate.setHours(0);
    // mydate.setMinutes(0);
    return mydate;
  }

  getCompletedDays(dates: EmploymentDate[]): number {
    let completedDays: number = 0;
    dates.forEach(day => {
      if (day.isActive || day.isComplete)
        completedDays++;
    });
    return completedDays;
  }


  /**
 * Simple timer
 */
  timer(startDate?: Date) {
    //let timeStart = new Date().getTime();
    let timeStart = startDate.getTime();
    return {
      /** <integer>s e.g 2s etc. */
      get seconds() {
        const seconds = Math.ceil((new Date().getTime() - timeStart) / 1000);
        return seconds;
      },
      /** Milliseconds e.g. 2000ms etc. */
      get ms() {
        const ms = (new Date().getTime() - timeStart);
        return ms;
      }
    }
  }

  // DAY CHANGE OR NOT CHECK
  shiftDayChange(dateObject: any, timeFrom: any, timeTo: any) {
    this.dayChange = false;
    let scheduledStartDate: DateTime = DateTime.local(dateObject[0], dateObject[1], dateObject[2], timeFrom[0], timeFrom[1]);
    let scheduledEndDate: DateTime = DateTime.local(dateObject[0], dateObject[1], dateObject[2], timeTo[0], timeTo[1]);
    scheduledStartDate.setLocale('in-IN');
    scheduledEndDate.setLocale('in-IN');
    if (scheduledStartDate.toString() > scheduledEndDate.toString()) {
      this.dayChange = true;
      this.newDayDate[0] = dateObject[0];
      this.newDayDate[1] = dateObject[1];
      this.newDayDate[2] = this.addDaysInDate(dateObject, 1);
    }
    return this.dayChange;
  }

  /**
  * Simple timer
  */
  hoursOfJob(dateObject: any, timeFrom: any, timeTo: any): number {
    let scheduledStartDate: DateTime = DateTime.local(dateObject[0], dateObject[1], dateObject[2], timeFrom[0], timeFrom[1]);
    let scheduledEndDate: DateTime = DateTime.local(dateObject[0], dateObject[1], dateObject[2], timeTo[0], timeTo[1]);
    scheduledStartDate.setLocale('in-IN');
    scheduledEndDate.setLocale('in-IN');

    let dateEndObject: any[] = [];
    dateEndObject = Object.assign(dateEndObject, dateObject);
    if (scheduledStartDate.toString() > scheduledEndDate.toString()) {
      dateEndObject[2] = this.addDaysInDate(dateObject, 1)
    }

    let jobStartDate = new Date(dateObject[0], dateObject[1], dateObject[2]);
    jobStartDate.setHours(timeFrom[0]);
    jobStartDate.setMinutes(timeFrom[1]);


    let jobEndDate = new Date(dateEndObject[0], dateEndObject[1], dateEndObject[2]);
    jobEndDate.setHours(timeTo[0]);
    jobEndDate.setMinutes(timeTo[1]);
    const jobEndTime = (jobEndDate.getTime() - jobStartDate.getTime()) / 1000;
    return Math.abs(jobEndTime / 3600);
  }

  // Add days into given date
  addDaysInDate(dateObject: any, days: number) {
    var futureDate = new Date(dateObject[0], dateObject[1], dateObject[2]);
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.getDate();
  }
}
