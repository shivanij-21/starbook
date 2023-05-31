import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SncasinoBetshistoryComponent } from './sncasino-betshistory.component';

describe('SncasinoBetshistoryComponent', () => {
  let component: SncasinoBetshistoryComponent;
  let fixture: ComponentFixture<SncasinoBetshistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SncasinoBetshistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SncasinoBetshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
