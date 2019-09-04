import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiivlabsBusinessComponent } from './liivlabs-business.component';

describe('LiivlabsBusinessComponent', () => {
  let component: LiivlabsBusinessComponent;
  let fixture: ComponentFixture<LiivlabsBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiivlabsBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiivlabsBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
