import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfildComponent } from './profild.component';

describe('ProfildComponent', () => {
  let component: ProfildComponent;
  let fixture: ComponentFixture<ProfildComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfildComponent]
    });
    fixture = TestBed.createComponent(ProfildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
