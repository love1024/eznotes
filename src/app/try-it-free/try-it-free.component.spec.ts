import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TryItFreeComponent } from './try-it-free.component';

describe('TryItFreeComponent', () => {
  let component: TryItFreeComponent;
  let fixture: ComponentFixture<TryItFreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TryItFreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TryItFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
