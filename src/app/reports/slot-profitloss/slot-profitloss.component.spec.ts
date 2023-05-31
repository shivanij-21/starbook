import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotProfitlossComponent } from './slot-profitloss.component';

describe('SlotProfitlossComponent', () => {
  let component: SlotProfitlossComponent;
  let fixture: ComponentFixture<SlotProfitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotProfitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
