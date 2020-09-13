import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLoginComponentComponent } from './ngx-login-component.component';

describe('NgxLoginComponentComponent', () => {
  let component: NgxLoginComponentComponent;
  let fixture: ComponentFixture<NgxLoginComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxLoginComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxLoginComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
