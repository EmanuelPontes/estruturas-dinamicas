import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
    providedIn: 'root'
})
export class LoaderService  {

    private count: number = 0;
    constructor(private readonly spinner: NgxSpinnerService) {

    }

    start() {
        if(++this.count === 1 ) {
            this.spinner.show();
        }
    }

    stop() {
        if(--this.count === 0 || this.count === 0) {
            this.spinner.hide();
        }

        if (this.count < 0) {
            this.count = 0;
        }
    }

    reset() {
        this.spinner.hide();
        this.count = 0;
    }
}