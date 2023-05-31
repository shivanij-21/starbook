import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwainComponent } from './twain.component';

describe('TwainComponent', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
