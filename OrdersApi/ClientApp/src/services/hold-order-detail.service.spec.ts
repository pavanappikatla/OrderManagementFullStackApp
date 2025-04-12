import { TestBed } from '@angular/core/testing';

import { HoldOrderDetailService } from './hold-order-detail.service';

describe('HoldOrderDetailService', () => {
  let service: HoldOrderDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoldOrderDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
