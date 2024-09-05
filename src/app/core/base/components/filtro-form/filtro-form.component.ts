import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModalSearch } from '../../models/modal-search';
import { modalButton } from '../modal-form/modal-form.component';
import { FormField } from './model/form-field.model';
import { DynamicFormBuilderService } from './service/dynamic-form-builder.service';

@Component({
  selector: 'app-filtro-form',
  templateUrl: './filtro-form.component.html',
  styleUrls: ['./filtro-form.component.scss']
})
export class FiltroFormComponent implements OnInit, OnDestroy, OnChanges  {


  @Input() 
  set formFields (value: FormField<any>[]) {
    this._fields$.next(value)
  };
  @Input() submitButtonText: string = "Salvar";
  @Input() clearButtonText: string = "Limpar";
  @Input() showActions: boolean = true;
  @Input() monChange: boolean = false;
  @Input() autoSubmit: boolean = false;
  @Input() modalSearchConfig: ModalSearch[] = [];
  @Input() searchFieldsSet: boolean = false;
  @Input() isCleanBtnHidden: boolean = false;
  private _fields$: BehaviorSubject<FormField<any>[]> = new BehaviorSubject<FormField<any>[]>([]);
  @Output() onSubmit = new EventEmitter();
  @Output() onUpdateChange = new EventEmitter();

   /**
   * @var unsub$
   */
  private unsub$ = new Subject<never>();
  form!: FormGroup;
  fields: FormField<any>[] = [];
  
  constructor(
    private dyFormBuilderService: DynamicFormBuilderService
  ) { }

  ngOnInit(): void {

  
    this._fields$.subscribe(fields => {
      this.fields = fields;
      this.form = this.dyFormBuilderService.toFormGoup(
        fields
      );

      if (this.monChange) {
        this.form.valueChanges.subscribe(form => {
          let obj = this.form.getRawValue()
          let keyTypeTable = this.fields.find(f => f.controlType === 'table')?.key;  
          if (keyTypeTable) {
            obj[keyTypeTable].forEach((o: any) => {
              if (o.action !== undefined) {
                delete o.action;
              }
    
              if (o.isEditable !== undefined) {
                delete o.isEditable;
              }
            })
          }
          
          
          this.onUpdateChange.emit(
            
            obj
          );
        })
      }

      if(this.fields.filter(f => f.value != null).length > 0 && this.autoSubmit) {
        this.onSubmit.emit(
            
          this.form.value
        );
      }
    })
    
    
    
    
    

  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  save() {
    if(this.form.valid) {
      this.onSubmit.emit(this.form.getRawValue());
    }
    
  }

  clear() {
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.cancelarFormSubs();
  }


  private cancelarFormSubs() {
    this.unsub$.next();
    this.unsub$.unsubscribe();
  }

  onSearchSet(obj: any) {

    if (!this.searchFieldsSet) {
      return;
    }
    for (const [key, value] of Object.entries(this.form.controls)) { 
      if (obj[key]) {
        value.setValue(obj[key]);
      }
    }
  }
}

