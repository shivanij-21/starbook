import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoBethistoryComponent } from './casino-bethistory.component';

describe('CasinoBethistoryComponent', () => {
  let component: CasinoBethistoryComponent;
  let fixture: ComponentFixture<CasinoBethistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoBethistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
