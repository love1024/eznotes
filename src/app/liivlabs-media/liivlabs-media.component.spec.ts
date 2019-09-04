import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiivlabsMediaComponent } from './liivlabs-media.component';

describe('LiivlabsMediaComponent', () => {
  let component: LiivlabsMediaComponent;
  let fixture: ComponentFixture<LiivlabsMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiivlabsMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiivlabsMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
