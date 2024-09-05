import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ModalConfirmComponent } from "../components/modal-confirm/modal-confirm.component";
import { modalButton } from "../components/modal-form/modal-form.component";
import { ModalMensagemComponent } from "../components/modal-mensagem/modal-mensagem.component";
import { ModalProgressBarComponent } from "../components/modal-progress-bar/modal-progress-bar.component";
import { Progress } from "../components/modal-progress-bar/progress";
import { ModalSearchComponent, ModalSearchService } from "../components/modal-search/modal-search.component";
import { BaseFilter } from "../models/base-filter.model";
import { ModalSearch } from "../models/modal-search";
import { CrudService } from "./crud.service";

@Injectable({
    providedIn: 'root'
  })
export class ModalService{
    
    constructor(public dialog: MatDialog) { }

    openSearch(config: ModalSearch, enterBtn?: modalButton, exitBtn?: modalButton) {
        const dialogRef = this.dialog.open(ModalSearchComponent,
            {
                data: {
                  service: config.service,
                  children:  config.children,
                }
            });
    
        if (enterBtn) {
            dialogRef.componentInstance.enterButtonText = enterBtn;
        }
    
        if (exitBtn) {
            dialogRef.componentInstance.exitButtonText = exitBtn;
        }

        dialogRef.componentInstance.multi = config.multi;
        dialogRef.componentInstance.isCleanBtnHidden = config.isCleanBtnHidden;
        return dialogRef.afterClosed();
      }

    openConfirm (msg: string, enterBtn?: modalButton, exitBtn?: modalButton,) {
        const dialogRef = this.dialog.open(ModalConfirmComponent,
            {
                data: {
                    msg: msg
                }
            });
    
        if (enterBtn) {
            dialogRef.componentInstance.enterButtonText = enterBtn;
        }
    
        if (exitBtn) {
            dialogRef.componentInstance.exitButtonText = exitBtn;
        }

        return dialogRef.afterClosed();
      }

    openMensagem(msg: string, titulo?: string, exitBtn?: modalButton) {
        const dialogRef = this.dialog.open(ModalMensagemComponent,
            {
                data: {
                    msg: msg
                }
            });
            
        if (exitBtn) {
            dialogRef.componentInstance.exitButtonText = exitBtn;
        }

        if (titulo) {
            dialogRef.componentInstance.title = titulo;
        }

        return dialogRef.afterClosed();
    }

    openProgressBarModal(observable: Observable<Progress>) {
        const dialogRef = this.dialog.open(ModalProgressBarComponent);
        dialogRef.componentInstance.observable = observable;
        return dialogRef;
    }
}