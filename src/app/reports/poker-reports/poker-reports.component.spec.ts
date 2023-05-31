import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerReportsComponent } from './poker-reports.component';

describe('PokerReportsComponent', () => {
  let component: PokerReportsComponent;
  let fixture: ComponentFixture<PokerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokerReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
