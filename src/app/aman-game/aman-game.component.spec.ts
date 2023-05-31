import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmanGameComponent } from './aman-game.component';

describe('AmanGameComponent', () => {
  let component: AmanGameComponent;
  let fixture: ComponentFixture<AmanGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmanGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmanGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
