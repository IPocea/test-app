import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiMatSearchInputComponent } from './ui-mat-search-input.component';

describe('UiMatSearchInputComponent', () => {
  let component: UiMatSearchInputComponent;
  let fixture: ComponentFixture<UiMatSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMatSearchInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiMatSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
