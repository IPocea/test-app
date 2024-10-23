import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCarDialogComponent } from './add-edit-car-dialog.component';

describe('AddEditCarDialogComponent', () => {
  let component: AddEditCarDialogComponent;
  let fixture: ComponentFixture<AddEditCarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCarDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
