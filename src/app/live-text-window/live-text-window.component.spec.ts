import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTextWindowComponent } from './live-text-window.component';

describe('LiveTextWindowComponent', () => {
  let component: LiveTextWindowComponent;
  let fixture: ComponentFixture<LiveTextWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveTextWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTextWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
