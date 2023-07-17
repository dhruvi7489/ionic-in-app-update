import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingJobTypeService {
  isJobTypeFirstPage: boolean = false;
  showExperience: boolean = false;

  constructor() { }
}
