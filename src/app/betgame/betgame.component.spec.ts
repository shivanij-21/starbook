import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgameComponent } from './betgame.component';

describe('BetgameComponent', () => {
  let component: BetgameComponent;
  let fixture: ComponentFixture<BetgameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
