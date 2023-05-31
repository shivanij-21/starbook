import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupernovaComponent } from './supernova.component';

describe('SupernovaComponent', () => {
  let component: SupernovaComponent;
  let fixture: ComponentFixture<SupernovaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupernovaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupernovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
