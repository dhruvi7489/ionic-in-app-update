import { TestBed } from '@angular/core/testing';

import { MyEarningsService } from './my-earnings.service';

describe('MyEarningsService', () => {
  let service: MyEarningsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyEarningsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
