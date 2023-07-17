import { TestBed } from '@angular/core/testing';

import { OnboardingJobTypeService } from './onboarding-job-type.service';

describe('OnboardingJobTypeService', () => {
  let service: OnboardingJobTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingJobTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
