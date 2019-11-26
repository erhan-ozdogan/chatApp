import { TestBed } from '@angular/core/testing';

import { FirestoreServiceService } from './firestore-service.service';

describe('FirestoreServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreServiceService = TestBed.get(FirestoreServiceService);
    expect(service).toBeTruthy();
  });
});
