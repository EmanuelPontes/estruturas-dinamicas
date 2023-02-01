import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormField } from './model/form-field.model';
import { DynamicFormBuilderService } from './service/dynamic-form-builder.service';

@Component({
  selector: 'app-filtro-form',
  templateUrl: './filtro-form.component.html',
  styleUrls: ['./filtro-form.component.scss']
})
export class FiltroFormComponent implements OnInit, OnDestroy {


  @Input() fields: FormField<any>[] = [];
  @Input() submitButtonText: string = "Salvar";
  @Input() clearButtonText: string = "Limpar";
  @Input() showActions: boolean = true;
  @Input() monChange: boolean = false;

  private _monChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output() onSubmit = new EventEmitter();
  

   /**
   * @var unsub$
   */
  private unsub$ = new Subject<never>();
  form!: FormGroup;
  
  constructor(
    private dyFormBuilderService: DynamicFormBuilderService
  ) { }

  ngOnInit(): void {

    this.form = this.dyFormBuilderService.toFormGoup(
      this.fields
    );
    
    if (this.monChange) {
      this.form.valueChanges.subscribe(form => {
        this.onSubmit.emit(this.form.getRawValue());
      })
    }
    
    

  }

  save() {
    this.onSubmit.emit(this.form.getRawValue());
  }

  clear() {
    
  }

  ngOnDestroy(): void {
    this.cancelarFormSubs();
  }


  private cancelarFormSubs() {
    this.unsub$.next();
    this.unsub$.unsubscribe();
  }
}

