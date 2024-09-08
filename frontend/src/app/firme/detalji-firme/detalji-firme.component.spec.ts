import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiFirmeComponent } from './detalji-firme.component';

describe('DetaljiFirmeComponent', () => {
  let component: DetaljiFirmeComponent;
  let fixture: ComponentFixture<DetaljiFirmeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetaljiFirmeComponent]
    });
    fixture = TestBed.createComponent(DetaljiFirmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
