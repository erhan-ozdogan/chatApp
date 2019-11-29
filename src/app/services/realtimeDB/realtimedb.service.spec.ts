import { TestBed } from '@angular/core/testing';

import { RealtimedbService } from './realtimedb.service';

describe('RealtimedbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealtimedbService = TestBed.get(RealtimedbService);
    expect(service).toBeTruthy();
  });
});
