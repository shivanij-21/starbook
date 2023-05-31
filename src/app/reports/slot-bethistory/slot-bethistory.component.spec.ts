import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotBethistoryComponent } from './slot-bethistory.component';

describe('SlotBethistoryComponent', () => {
  let component: SlotBethistoryComponent;
  let fixture: ComponentFixture<SlotBethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotBethistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
