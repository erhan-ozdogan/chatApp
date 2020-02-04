import { TestBed } from '@angular/core/testing';

import { SQLService } from './sql.service';

describe('SQLService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SQLService = TestBed.get(SQLService);
    expect(service).toBeTruthy();
  });
});
