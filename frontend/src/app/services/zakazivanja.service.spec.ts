import { TestBed } from '@angular/core/testing';

import { ZakazivanjaService } from './zakazivanja.service';

describe('ZakazivanjaService', () => {
  let service: ZakazivanjaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZakazivanjaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
