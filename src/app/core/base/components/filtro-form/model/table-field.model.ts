import { FormField } from "./form-field.model";


export class TableField extends FormField<Array<any> > {
    override controlType = "table";
}