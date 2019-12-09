import { TestBed } from '@angular/core/testing';

import { BleService } from './ble.service';

describe('BleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BleService = TestBed.get(BleService);
    expect(service).toBeTruthy();
  });
});
