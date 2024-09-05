import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { modalButton } from '../modal-form/modal-form.component';

@Component({
  selector: 'app-modal-form-file',
  templateUrl: './modal-form-file.component.html',
  styleUrls: ['./modal-form-file.component.scss']
})
export class ModalFormFileComponent implements OnInit {
  @Input() title: string = 'Selecionar arquivo';
  @Input() enterButtonText: modalButton = {label: "Confirmar", hide: false};
  @Input() exitButtonText: modalButton = {label: "Cancelar", hide: false};
  form: FormGroup = new FormGroup({
    file: new FormControl()
  });
  constructor(public dialogRef: MatDialogRef<ModalFormFileComponent>,) { }

  get file() {
    return this.form.get('file');
  }
  public onFileChange(event: any) {

    if(event.target.files && event.target.files.length) {
      let fileList: FileList = event.target.files;
      let file: File = fileList[0];
      console.log(file);
      this.file.setValue(file);
    }

  }
  ngOnInit(): void {
  }

  salvar() {
    this.dialogRef.close(this.file.value);
  }

}
