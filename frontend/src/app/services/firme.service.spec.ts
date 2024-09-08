import { TestBed } from '@angular/core/testing';

import { FirmeService } from './firme.service';

describe('FirmeService', () => {
  let service: FirmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
