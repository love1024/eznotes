import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechToTextItemComponent } from './speech-to-text-item.component';

describe('SpeechToTextItemComponent', () => {
  let component: SpeechToTextItemComponent;
  let fixture: ComponentFixture<SpeechToTextItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechToTextItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechToTextItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
