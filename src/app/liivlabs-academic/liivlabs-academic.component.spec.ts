import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiivlabsAcademicComponent } from './liivlabs-academic.component';

describe('LiivlabsAcademicComponent', () => {
  let component: LiivlabsAcademicComponent;
  let fixture: ComponentFixture<LiivlabsAcademicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiivlabsAcademicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiivlabsAcademicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
