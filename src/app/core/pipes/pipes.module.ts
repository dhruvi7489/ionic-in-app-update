import { NgModule } from '@angular/core';
import { FormateDatePipe } from './date.pipe';
import { DescriptionPipe } from './description.pipe';
import { FormateTimePipe } from './time.pipe';

@NgModule({
    declarations: [DescriptionPipe, FormateDatePipe, FormateTimePipe],
    imports: [],
    exports: [DescriptionPipe, FormateDatePipe, FormateTimePipe]
})
export class PipesModule { }