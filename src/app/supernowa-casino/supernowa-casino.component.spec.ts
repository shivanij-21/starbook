import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupernowaCasinoComponent } from './supernowa-casino.component';

describe('SupernowaCasinoComponent', () => {
  let component: SupernowaCasinoComponent;
  let fixture: ComponentFixture<SupernowaCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupernowaCasinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupernowaCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
