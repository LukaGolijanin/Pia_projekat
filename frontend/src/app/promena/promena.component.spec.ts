import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromenaComponent } from './promena.component';

describe('PromenaComponent', () => {
  let component: PromenaComponent;
  let fixture: ComponentFixture<PromenaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromenaComponent]
    });
    fixture = TestBed.createComponent(PromenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
