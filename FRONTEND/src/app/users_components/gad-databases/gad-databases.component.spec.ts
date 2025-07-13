import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadDatabasesComponent } from './gad-databases.component';

describe('GadDatabasesComponent', () => {
  let component: GadDatabasesComponent;
  let fixture: ComponentFixture<GadDatabasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GadDatabasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadDatabasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
