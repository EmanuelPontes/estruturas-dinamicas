import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroFormComponent } from './components/filtro-form/filtro-form.component';
import { ApresTableComponent } from './components/apres-table/apres-table.component';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldComponent } from './components/field/field.component';
import { DynamicFormBuilderService } from './components/filtro-form/service/dynamic-form-builder.service';
import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { ToastrModule } from 'ngx-toastr';
import { AlertService } from './services/alert.service';


@NgModule({
  declarations: [
    FiltroFormComponent,
    ApresTableComponent,
    ActionMenuComponent,
    FieldComponent,
    ModalFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatButtonModule,
    FontAwesomeModule,
    MatDialogModule,
    ToastrModule,
  ],
  exports: [
    FiltroFormComponent,
    ApresTableComponent,
    ActionMenuComponent,
    ModalFormComponent,
  ],
  providers: [
    DynamicFormBuilderService,
    AlertService
  ]
})
export class BaseModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }

}
