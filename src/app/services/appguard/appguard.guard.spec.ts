import { TestBed, async, inject } from '@angular/core/testing';

import { AppguardGuard } from './appguard.guard';

describe('AppguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppguardGuard]
    });
  });

  it('should ...', inject([AppguardGuard], (guard: AppguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
