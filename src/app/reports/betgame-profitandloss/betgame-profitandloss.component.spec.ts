import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgameProfitandlossComponent } from './betgame-profitandloss.component';

describe('BetgameProfitandlossComponent', () => {
  let component: BetgameProfitandlossComponent;
  let fixture: ComponentFixture<BetgameProfitandlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetgameProfitandlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgameProfitandlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
