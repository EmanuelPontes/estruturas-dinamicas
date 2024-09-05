import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { AlertService } from '../../services/alert.service';


export type CustomBtn = {
  id: number;
  label: string;
  icon: IconProp;
  color: string;
}
export enum BasicCrudBtn {
  NEW = 0,
  EDIT = 1,
  VIEW = 2,
  DELETE = 3
}
export function getBasicCrudBtns(): Array<CustomBtn> {
  return [
    {
      id: 0,
      label: "New",
      icon: "plus",
      color: "primary"
    },
    {
      id: 1,
      label: "Edit",
      icon: "pencil-alt",
      color: "accent"
    },
    {
      id: 2,
      label: "View",
      icon: "eye",
      color: "warning"
    },
    {
      id: 3,
      label: "Delete",
      icon: "trash",
      color: "danger"
    }
  ]
}
@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {

  @Input() customBtnSet: CustomBtn[] = [];
  @Output() onCustomClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private messageService: AlertService,
  ) { }
  ngOnInit(): void {
  }

  customClick(event: any) {
    this.onCustomClick.emit(event);
  }

}
