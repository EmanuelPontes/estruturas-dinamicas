import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { interval, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { handleError } from '../../functions/util';
import { AlertService } from '../../services/alert.service';
import { ModalService } from '../../services/modal.service';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { Progress } from './progress';

@Component({
  selector: 'app-modal-progress-bar',
  templateUrl: './modal-progress-bar.component.html',
  styleUrls: ['./modal-progress-bar.component.scss']
})
export class ModalProgressBarComponent implements OnInit {


  title = "Aguarde seu arquivo esta sendo enviado...";
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  @Input()
  observable: Observable<Progress> =  new Observable<Progress>();
  @Input()
  public value = 0;
  
  private stopPolling = new Subject();
  
  constructor( public dialogRef: MatDialogRef<ModalProgressBarComponent>,
    private modalService: ModalService,
    private cdref: ChangeDetectorRef,
    private alertService: AlertService,) { 
      dialogRef.disableClose = true;
      this.cdref.detach();
    }

  ngOnInit(): void {
    this.progressPolling();
  }

  public progressPolling() {
    let  subs = interval(500).pipe(
      switchMap(() => {
          return this.observable
      }),
        takeUntil(this.stopPolling)
    ).subscribe(
        (data) => {
            this.value = ((data.linhasProcessadas / data.totalDeLinhas) * 100);
            this.cdref.detectChanges();
            if (data.status == "FINALIZADO" || this.value === 100) {
              this.stopPolling.next();
              this.dialogRef.close();
            }
        },
        error => { 
          this.alertService.msgErro(handleError(error))
          this.stopPolling.next();
          this.dialogRef.close();
        },
    );
  }

}
