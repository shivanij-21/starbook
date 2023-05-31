import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinoProfitlossComponent } from './sncasino-profitloss.component';

describe('SncasinoProfitlossComponent', () => {
  let component: SncasinoProfitlossComponent;
  let fixture: ComponentFixture<SncasinoProfitlossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinoProfitlossComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinoProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
