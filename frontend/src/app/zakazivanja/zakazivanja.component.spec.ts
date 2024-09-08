import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakazivanjaComponent } from './zakazivanja.component';

describe('ZakazivanjaComponent', () => {
  let component: ZakazivanjaComponent;
  let fixture: ComponentFixture<ZakazivanjaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZakazivanjaComponent]
    });
    fixture = TestBed.createComponent(ZakazivanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
