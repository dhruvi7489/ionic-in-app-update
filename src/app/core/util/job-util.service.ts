import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { EmploymentDate } from '../modal/employment.modal';

@Injectable({
  providedIn: 'root'
})
export class JobUtilervice {
  constructor() { }


  distanceBetweenLatLong(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        // if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}

  travelTimeFromDistance(distance: any) {
    let time = (parseFloat(distance)*6);

    if((time/60) <= 1) {
      return Math.floor(time) +' mins';
    }else {
      return Math.floor(time/60) +' hrs';
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

 /**
 * Simple timer
 */
hoursOfJob(start: any, end: any): number { 
  let jobStartDate = new Date();
  jobStartDate.setHours(start[0]);
  jobStartDate.setMinutes(start[1]);


  let jobEndDate = new Date();
  jobEndDate.setHours(end[0]);
  jobEndDate.setMinutes(end[1]);

  const jobEndTime = (jobEndDate.getTime()  - jobStartDate.getTime())/1000;
  return Math.abs(jobEndTime/3600);
}
  
}
