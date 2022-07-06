import { TestBed } from '@angular/core/testing';

import { ActiveJobService } from './active-job.service';

describe('ActiveJobService', () => {
  let service: ActiveJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
