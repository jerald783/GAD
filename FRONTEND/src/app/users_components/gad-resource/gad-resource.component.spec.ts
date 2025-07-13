import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadResourceComponent } from './gad-resource.component';

describe('GadResourceComponent', () => {
  let component: GadResourceComponent;
  let fixture: ComponentFixture<GadResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GadResourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
