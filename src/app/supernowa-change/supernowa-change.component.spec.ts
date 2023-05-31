import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupernowaChangeComponent } from './supernowa-change.component';

describe('SupernowaChangeComponent', () => {
  let component: SupernowaChangeComponent;
  let fixture: ComponentFixture<SupernowaChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupernowaChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupernowaChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
