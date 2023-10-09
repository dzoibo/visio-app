import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallManagerComponent } from './call-manager.component';

describe('CallManagerComponent', () => {
  let component: CallManagerComponent;
  let fixture: ComponentFixture<CallManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CallManagerComponent]
    });
    fixture = TestBed.createComponent(CallManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
