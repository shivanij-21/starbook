import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgameBettinghistoryComponent } from './betgame-bettinghistory.component';

describe('BetgameBettinghistoryComponent', () => {
  let component: BetgameBettinghistoryComponent;
  let fixture: ComponentFixture<BetgameBettinghistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgameBettinghistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgameBettinghistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
