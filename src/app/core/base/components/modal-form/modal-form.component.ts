import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModalConfirm } from '../../models/modal-confirm';
import { ModalSearch } from '../../models/modal-search';
import { ModalService } from '../../services/modal.service';
import { FormField } from '../filtro-form/model/form-field.model';

export type modalButton = {
  label: string;
  hide: boolean;
};

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit {

  
  @Input() title: string = 'Novo';
  @Input() enterButtonText: modalButton = {label: "Salvar", hide: false};
  @Input() exitButtonText: modalButton = {label: "Cancelar", hide: false};
  
  formObjectResult: any = null;
  filtroForm: FormField<any>[] = []
  constructor( 
    public dialogRef: MatDialogRef<ModalFormComponent>,
    private modalService: ModalService, 
    @Inject(MAT_DIALOG_DATA) public data: 
    
    {
      form$: Observable<FormField<any>[]>,
      searchConfig: ModalSearch[],
      confirmConfig?:  ModalConfirm,
    }) {}

  ngOnInit(): void {
    this.data.form$.subscribe(data => this.filtroForm = data);
  }


  atualizar(event: any) {
    this.formObjectResult = event;
    this.data.searchConfig.forEach(sc => sc.service.fillFilterFormExternally?.next(event));
  }

  salvar() {

    if (this.data.confirmConfig) {

      this.modalService.openConfirm(this.data.confirmConfig.msg).subscribe(result => {

        if(result == 'ok') {
          this.dialogRef.close(this.formObjectResult );
        }

      })

    } else {
      if (this.formObjectResult !== undefined && this.formObjectResult !== null) {
        this.dialogRef.close(this.formObjectResult);
      }
      
    }
    
  }

 
}
