import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZakazivanjadComponent } from './zakazivanjad.component';

describe('ZakazivanjadComponent', () => {
  let component: ZakazivanjadComponent;
  let fixture: ComponentFixture<ZakazivanjadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZakazivanjadComponent]
    });
    fixture = TestBed.createComponent(ZakazivanjadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
