import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorseHighlightComponent } from './horse-highlight.component';

describe('HorseHighlightComponent', () => {
  let component: HorseHighlightComponent;
  let fixture: ComponentFixture<HorseHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorseHighlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorseHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
