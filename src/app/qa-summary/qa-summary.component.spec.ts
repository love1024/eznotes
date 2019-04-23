import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaSummaryComponent } from './qa-summary.component';

describe('QaSummaryComponent', () => {
  let component: QaSummaryComponent;
  let fixture: ComponentFixture<QaSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
