import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiivlabsLegalComponent } from './liivlabs-legal.component';

describe('LiivlabsLegalComponent', () => {
  let component: LiivlabsLegalComponent;
  let fixture: ComponentFixture<LiivlabsLegalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiivlabsLegalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiivlabsLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
