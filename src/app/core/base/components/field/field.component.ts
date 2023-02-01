import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormField } from '../filtro-form/model/form-field.model';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {


  @Input() field!: FormField<any>;
  @Input()form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  get isValid(): boolean {
    return this.form.controls[this.field.key].valid;
  }

}
