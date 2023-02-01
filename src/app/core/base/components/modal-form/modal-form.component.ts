import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormField } from '../filtro-form/model/form-field.model';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss']
})
export class ModalFormComponent implements OnInit {

  
  @Input() enterButtonText: string = "Salvar";
  @Input() exitButtonText: string = "Cancelar";
  
  formObjectResult: any = null;
  constructor( 
    public dialogRef: MatDialogRef<ModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormField<any>[]) {}

  ngOnInit(): void {
  }


  atualizar(event: any) {
    this.formObjectResult = event;
  }

  salvar() {
    this.dialogRef.close(this.formObjectResult );
  }
}
