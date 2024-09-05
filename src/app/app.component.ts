import { Component, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DadosOrigemTabela } from './core/base/components/apres-table/model/dados-origem-tabela.model';
import { FormField } from './core/base/components/filtro-form/model/form-field.model';
import { DynamicFormBuilderService } from './core/base/components/filtro-form/service/dynamic-form-builder.service';
import { ModalFormComponent } from './core/base/components/modal-form/modal-form.component';
import { CrudComponent } from './core/base/CrudComponent';
import { BaseFilter } from './core/base/models/base-filter.model';
import { CrudService } from './core/base/services/crud.service';
import { AlertService } from './core/base/services/alert.service';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Injectable(
  {providedIn: 'root'}
)
export class AppService extends CrudService<String, BaseFilter, String> {
  constructor(private dyFormService: DynamicFormBuilderService,
    protected http: HttpClient
    ) {
    super(`#`, http);
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends CrudComponent<String, BaseFilter, String>{
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

  constructor(public service: AppService, 
    public dyFormService: DynamicFormBuilderService,
    public alertService: AlertService,
    public dialog: MatDialog,
    public titleService: Title) {
    super('APP', titleService, service, alertService,dyFormService, service.getFormFiltro(), service.getForm(), dialog);
  }

  salvar(event: any){
    alert(JSON.stringify(event));
  }

  selecionado(event:   any){
    alert(JSON.stringify(event));
    this.itemSelecionado = event;
  }

  openDialog() {

    this.dyFormService.getFields().toPromise().then(data => {
      const dialogRef = this.dialog.open(ModalFormComponent,
      
        {
          data: data
        });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    })
    
  }
}
