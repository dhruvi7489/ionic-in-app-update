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
      newDate = new Date(val[0] + '-' + val[1] + '-' + val[2]);
    } catch{
      return;
    }
    return newDate;
  }

}
