import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { modalButton } from '../modal-form/modal-form.component';

//check the use of this modal and eliminate it or merge into one solution with modal confirm
@Component({
  selector: 'app-modal-mensagem',
  templateUrl: './modal-mensagem.component.html',
  styleUrls: ['./modal-mensagem.component.scss']
})
export class ModalMensagemComponent implements OnInit {

  @Input() title: string = 'Aviso';
  @Input() exitButtonText: modalButton = {label: "Fechar", hide: false};
  
  formObjectResult: any = null;
  constructor( 
    public dialogRef: MatDialogRef<ModalMensagemComponent>,
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
