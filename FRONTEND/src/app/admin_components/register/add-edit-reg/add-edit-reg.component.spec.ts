import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRegComponent } from './add-edit-reg.component';

describe('AddEditRegComponent', () => {
  let component: AddEditRegComponent;
  let fixture: ComponentFixture<AddEditRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
