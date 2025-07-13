import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRegComponent } from './show-reg.component';

describe('ShowRegComponent', () => {
  let component: ShowRegComponent;
  let fixture: ComponentFixture<ShowRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowRegComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
