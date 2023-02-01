import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    private readonly toastrService: ToastrService,
  ) {}

  public msgSucesso(msg: string, title: string = '') {
    return this.toastrService.success(
      msg, title
    );
  }

  public msgErro(msg: string, title: string = '') {
    return this.toastrService.error(
        msg, title
    );
  }

  public msgInfo(msg: string, title: string = '') {
    return this.toastrService.info(msg, title);
  }
}
