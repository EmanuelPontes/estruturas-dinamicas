import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormFileComponent } from './modal-form-file.component';

describe('ModalFormFileComponent', () => {
  let component: ModalFormFileComponent;
  let fixture: ComponentFixture<ModalFormFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFormFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
