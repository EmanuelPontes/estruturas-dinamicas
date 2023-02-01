import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApresTableComponent } from './apres-table.component';

describe('ApresTableComponent', () => {
  let component: ApresTableComponent;
  let fixture: ComponentFixture<ApresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApresTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
