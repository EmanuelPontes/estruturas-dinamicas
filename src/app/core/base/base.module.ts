import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroFormComponent } from './components/filtro-form/filtro-form.component';
import { ApresTableComponent, CustomPaginator } from './components/apres-table/apres-table.component';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldComponent } from './components/field/field.component';
import { DynamicFormBuilderService } from './components/filtro-form/service/dynamic-form-builder.service';
import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { ToastrModule } from 'ngx-toastr';
import { AlertService } from './services/alert.service';
import { CrudService } from './services/crud.service';
import { ModalSearchComponent } from './components/modal-search/modal-search.component';
import { MatIconModule } from '@angular/material/icon';
import { ModalService } from './services/modal.service';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import { NgxMaskModule } from 'ngx-mask';
import { ModalFormFileComponent } from './components/modal-form-file/modal-form-file.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { DougnutChartComponent } from './components/charts/DougnutChart.component';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponent } from './components/charts/BarChart.component';
import { LoaderService } from './services/loader.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TableFormComponent } from './components/table-form/table-form.component';
import { ModalProgressBarComponent } from './components/modal-progress-bar/modal-progress-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ModalMensagemComponent } from './components/modal-mensagem/modal-mensagem.component';
import { TransferSelectComponent } from './components/transfer-select/transfer-select.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    FiltroFormComponent,
    ApresTableComponent,
    ActionMenuComponent,
    FieldComponent,
    ModalFormComponent,
    ModalSearchComponent,
    ModalFormFileComponent,
    ModalConfirmComponent,
    ModalMensagemComponent,
    DougnutChartComponent,
    BarChartComponent,
    TableFormComponent,
    ModalProgressBarComponent,
    TransferSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule,
    MatDialogModule,
    ToastrModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskModule,
    MatDividerModule,
    DragDropModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSelectModule,
    NgChartsModule,
    NgxSpinnerModule,
    NgxMatSelectSearchModule,
    
  ],
  exports: [
    FiltroFormComponent,
    ApresTableComponent,
    ActionMenuComponent,
    ModalFormComponent,
    ModalSearchComponent,
    ModalMensagemComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    DragDropModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,       
    DougnutChartComponent,
    TransferSelectComponent,
    NgChartsModule,
    BarChartComponent,
    NgxSpinnerModule,
    TableFormComponent,
    MatProgressBarModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    DynamicFormBuilderService,
    AlertService,
    ModalService,
    LoaderService,
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class BaseModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }

}
