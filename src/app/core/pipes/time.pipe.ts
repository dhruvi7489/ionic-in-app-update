import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormateTimePipe implements PipeTransform {
  transform(val: any | null): any {
    if (!val || val.length < 2) {
      return '';
    }
    let newTime = new Date();
    newTime.setHours(val[0]);
    newTime.setMinutes(val[1]);
    return newTime;
  }

}
