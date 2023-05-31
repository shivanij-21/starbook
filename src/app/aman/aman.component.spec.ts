import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmanComponent } from './aman.component';

describe('AmanComponent', () => {
  let component: AmanComponent;
  let fixture: ComponentFixture<AmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
