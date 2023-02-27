import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormateDatePipe implements PipeTransform {
  transform(val: any | null): any {
    if (!val || val.length < 3) {
      return '';
    }
    let newDate = new Date();
    try {
      // let jobEndDate = new Date(dateEndObject[0] , dateEndObject[1] , dateEndObject[2]);
      newDate = new Date(val[0], val[1], val[2]);
      // newDate = new Date(val[0] , val[1] , val[2]);
      // newDate = new Date(val[0] , val[1] , val[2]);
      // newDate.setHours(val[3]);
      // newDate.setMinutes(val[4]);
    } catch {
      return;
    }
    return newDate;
  }

}
