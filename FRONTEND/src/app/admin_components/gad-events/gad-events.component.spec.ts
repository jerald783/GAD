import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadEventsComponent } from './gad-events.component';

describe('GadEventsComponent', () => {
  let component: GadEventsComponent;
  let fixture: ComponentFixture<GadEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GadEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
