import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSpinnerComponent } from './ui-spinner.component';

describe('UiSpinnerComponent', () => {
  let component: UiSpinnerComponent;
  let fixture: ComponentFixture<UiSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UiSpinnerComponent],
    });
    fixture = TestBed.createComponent(UiSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
