import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreyHighlightComponent } from './grey-highlight.component';

describe('GreyHighlightComponent', () => {
  let component: GreyHighlightComponent;
  let fixture: ComponentFixture<GreyHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreyHighlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreyHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
