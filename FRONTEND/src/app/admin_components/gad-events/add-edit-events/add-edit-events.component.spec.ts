import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditEventsComponent } from './add-edit-events.component';

describe('AddEditEventsComponent', () => {
  let component: AddEditEventsComponent;
  let fixture: ComponentFixture<AddEditEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
