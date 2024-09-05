import { Injectable } from "@angular/core";
import { CrudService } from "./crud.service";

@Injectable()
export class GenericCrudDecorator extends CrudService<any, any, any>{

}
