import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceItemIconComponent } from './service-item-icon.component';

describe('ServiceItemIconComponent', () => {
  let component: ServiceItemIconComponent;
  let fixture: ComponentFixture<ServiceItemIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceItemIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
