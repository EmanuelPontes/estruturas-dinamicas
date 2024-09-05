import { ModalSearchService } from "../components/modal-search/modal-search.component";
import { CrudService } from "../services/crud.service";
import { BaseFilter } from "./base-filter.model";

export class ModalSearch {
    key: string;
    isCleanBtnHidden?: boolean = false;
    multi: boolean = false;
    service: ModalSearchService;
    children: ModalSearch[] = [];
}