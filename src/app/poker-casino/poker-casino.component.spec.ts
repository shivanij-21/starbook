import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerCasinoComponent } from './poker-casino.component';

describe('PokerCasinoComponent', () => {
  let component: PokerCasinoComponent;
  let fixture: ComponentFixture<PokerCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokerCasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
