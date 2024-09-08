import { TestBed } from '@angular/core/testing';

import { OdbijeniceService } from './odbijenice.service';

describe('OdbijeniceService', () => {
  let service: OdbijeniceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdbijeniceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
