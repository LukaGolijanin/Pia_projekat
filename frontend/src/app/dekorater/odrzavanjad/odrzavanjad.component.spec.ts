import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdrzavanjadComponent } from './odrzavanjad.component';

describe('OdrzavanjadComponent', () => {
  let component: OdrzavanjadComponent;
  let fixture: ComponentFixture<OdrzavanjadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdrzavanjadComponent]
    });
    fixture = TestBed.createComponent(OdrzavanjadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
