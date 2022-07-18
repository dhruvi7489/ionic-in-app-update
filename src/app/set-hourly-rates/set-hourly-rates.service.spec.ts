import { TestBed } from '@angular/core/testing';

import { SetHourlyRatesService } from './set-hourly-rates.service';

describe('SetHourlyRatesService', () => {
  let service: SetHourlyRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetHourlyRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
