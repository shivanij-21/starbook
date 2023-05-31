import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteBannerComponent } from './promote-banner.component';

describe('PromoteBannerComponent', () => {
  let component: PromoteBannerComponent;
  let fixture: ComponentFixture<PromoteBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoteBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
