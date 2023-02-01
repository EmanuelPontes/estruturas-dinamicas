import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DadosOrigemTabela } from './core/base/components/apres-table/model/dados-origem-tabela.model';
import { FormField } from './core/base/components/filtro-form/model/form-field.model';
import { DynamicFormBuilderService } from './core/base/components/filtro-form/service/dynamic-form-builder.service';
import { ModalFormComponent } from './core/base/components/modal-form/modal-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ips-inventario';

  itemSelecionado: any;

  fields$: Observable<FormField<any>[]>;
  dadosOrigem: DadosOrigemTabela[] = [
    {
      objeto: {
        nome: 'Adilson',
        idade: 13,
        cidade: 'Balsa Nova',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    },
    {
      objeto: {
        nome: 'Jose',
        idade: 31,
        cidade: 'Curiba',
        estado: 'Parana'
      },
      formatarExibicao: (a: any) => {
        return ''
      }
    }

  ];

  constructor(
    private dyFormBuilderService: DynamicFormBuilderService,
    public dialog: MatDialog
  ) { 
    this.fields$ = this.dyFormBuilderService.getFields();

  }

  salvar(event: any){
    alert(JSON.stringify(event));
  }

  selecionado(event:   any){
    alert(JSON.stringify(event));
    this.itemSelecionado = event;
  }

  openDialog() {

    this.dyFormBuilderService.getFields().toPromise().then(data => {
      const dialogRef = this.dialog.open(ModalFormComponent,
      
        {
          data: data
        });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    })
    
  }

  editar() {

    if (!this.itemSelecionado){
      return;
    }
    const dialogRef = this.dialog.open(ModalFormComponent,
      
      {
        data: this.dyFormBuilderService.objecToFormFieldArray(this.itemSelecionado)
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
