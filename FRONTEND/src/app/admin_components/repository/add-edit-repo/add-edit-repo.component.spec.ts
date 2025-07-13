import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRepoComponent } from './add-edit-repo.component';

describe('AddEditRepoComponent', () => {
  let component: AddEditRepoComponent;
  let fixture: ComponentFixture<AddEditRepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditRepoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
