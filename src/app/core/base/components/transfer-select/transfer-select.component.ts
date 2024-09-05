import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-transfer-select',
  templateUrl: './transfer-select.component.html',
  styleUrls: ['./transfer-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() =>TransferSelectComponent),
      multi: true
    }
  ]
})
export class TransferSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input()
  set sourceList(list: any[]) {
    if (list) {
      this._originalList = list;

      if (this.destinationList.length > 0) {
        let distincList = this._originalList.filter((val, i) => this.destinationList.find(item => item[this.objKey] === val[this.objKey]) === undefined);
        this._copyList = distincList.map(obj => Object.assign({}, obj));
      } else {
        this._copyList = this._originalList.map(obj => Object.assign({}, obj));
      }

      this.sortAlpha(this._copyList);
      
    }
    
  }

  

  get sourceList() {
    return this._copyList ? this._copyList : [];
  }
  @Input() titleRight: string = '';
  @Input() titleLeft: string = '';
  @Input() objKey: string = '';
  @Input() filtroBusca: boolean = false;

  @Output() 
  onSourceChange: EventEmitter<any[]> = new EventEmitter();

  destinationList: any[] = [];

  attrbSourceList: any[] = [];
  attrbDestinationList: any[] = [];

  private _originalList: any[] = [];
  private _copyList: any[] = [];

  isDisabled: boolean = false;
  isRemoveDisabled: boolean = false;
  isAddDisabled: boolean = false;
  onChange!: (value: any[]) => void;
  onTouched!: () => void;

  constructor() {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    
  }
  
  writeValue(obj: any[]): void {
    if (obj) {
      this.destinationList = obj;
      
    }
    
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.isRemoveDisabled = isDisabled;
    this.isAddDisabled = isDisabled;
  }

  ngOnInit(): void {
    
  }

  onAdd() {
    if(this.isDisabled) {
      return;
    }

    this.attrbSourceList.forEach(a => {
      let idx = this.sourceList.indexOf(a);
      if (idx !== -1) {
        this.sourceList.splice(idx,1);
      }
      
      this.destinationList.push(a);
    })

    this.sortAlpha(this.destinationList);
    this.notify();
  }

  onAddAll() {
    if(this.isDisabled || this.sourceList.length === 0) {
      return;
    }
    this.attrbSourceList = this.sourceList.slice();
    this.onAdd()
  }

  onRemove() {
    if(this.isDisabled) {
      return;
    }

    this.attrbDestinationList.forEach(a => {
      let idx = this.destinationList.indexOf(a);
      if (idx !== -1) {
        this.destinationList.splice(idx,1);
      }
      this.sourceList.push(a);
    });

    this.sortAlpha(this.sourceList);
    this.notify();
  }

  private sortAlpha(arr: any[]) {
    arr.sort((a, b) => {
      if (a[this.objKey] < b[this.objKey]) { return -1; }
      if (a[this.objKey] > b[this.objKey]) { return 1; }
      return 0;
    });
  }

  onRemoveAll() {
    if(this.isDisabled || this.destinationList.length === 0) {
      return;
    }

    this.attrbDestinationList = this.destinationList.slice();
    this.onRemove()
  }

  dbClickDestination() {
    this.onRemove();
  }

  dbClickSource() {
    this.onAdd();
  }

  onKeyUp(event: any, ) {

    let term = event.target.value;
    
    if (this.destinationList.length > 0) {
      let distincList = this._originalList.filter((val, i) => this.destinationList.find(item => item[this.objKey] === val[this.objKey]) === undefined);
      this._copyList = distincList.filter(item => item[this.objKey]?.toLowerCase().indexOf(term.toLowerCase()) > -1).map(obj => Object.assign({}, obj));
    } else {
      this._copyList = this._originalList.filter(item => item[this.objKey]?.toLowerCase().indexOf(term.toLowerCase()) > -1).map(obj => Object.assign({}, obj));
    }
  }


  private notify() {
    this.onSourceChange.emit(this._copyList);
    this.onChange(this.destinationList.map(obj => Object.assign({}, obj)));
    this.onTouched();
  }

  private remove(selected: any[], originArr: any[]) {
    selected.forEach(a => {
      let idx = originArr.indexOf(a);
      if (idx !== -1) {
        originArr.splice(idx,1);
      }
    });
  }
}
