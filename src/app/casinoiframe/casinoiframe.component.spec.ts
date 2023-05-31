import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoiframeComponent } from './casinoiframe.component';

describe('CasinoiframeComponent', () => {
  let component: CasinoiframeComponent;
  let fixture: ComponentFixture<CasinoiframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasinoiframeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoiframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
