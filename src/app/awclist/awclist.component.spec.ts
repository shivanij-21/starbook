import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwclistComponent } from './awclist.component';

describe('AwclistComponent', () => {
  let component: AwclistComponent;
  let fixture: ComponentFixture<AwclistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwclistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AwclistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
