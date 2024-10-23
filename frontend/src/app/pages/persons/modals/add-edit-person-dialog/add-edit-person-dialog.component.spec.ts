import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPersonDialogComponent } from './add-edit-person-dialog.component';

describe('AddEditPersonDialogComponent', () => {
  let component: AddEditPersonDialogComponent;
  let fixture: ComponentFixture<AddEditPersonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPersonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPersonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
