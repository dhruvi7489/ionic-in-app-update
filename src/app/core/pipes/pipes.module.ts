import { NgModule } from '@angular/core';
import { FormateDatePipe } from './date.pipe';
import { DescriptionPipe } from './description.pipe';
import { SafePipe } from './security.pipe';
import { FormateTimePipe } from './time.pipe';

@NgModule({
    declarations: [DescriptionPipe, FormateDatePipe, FormateTimePipe, SafePipe],
    imports: [],
    exports: [DescriptionPipe, FormateDatePipe, FormateTimePipe, SafePipe]
})
export class PipesModule { }