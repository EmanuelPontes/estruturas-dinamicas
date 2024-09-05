import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProgressBarComponent } from './modal-progress-bar.component';

describe('ModalProgressBarComponent', () => {
  let component: ModalProgressBarComponent;
  let fixture: ComponentFixture<ModalProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProgressBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
