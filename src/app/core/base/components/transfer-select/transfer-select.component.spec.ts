import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSelectComponent } from './transfer-select.component';

describe('TransferSelectComponent', () => {
  let component: TransferSelectComponent;
  let fixture: ComponentFixture<TransferSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
