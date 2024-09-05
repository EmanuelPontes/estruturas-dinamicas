import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { modalButton } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  @Input() title: string = 'Aviso';
  @Input() enterButtonText: modalButton = {label: "Confirmar", hide: false};
  @Input() exitButtonText: modalButton = {label: "Cancelar", hide: false};
  
  formObjectResult: any = null;
  constructor( 
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: 
    
    {
      msg: string
    }) {}

  ngOnInit(): void {
  }


  atualizar(event: any) {
    this.formObjectResult = event;
  }

  salvar() {
    this.dialogRef.close(this.formObjectResult );
  }

}
