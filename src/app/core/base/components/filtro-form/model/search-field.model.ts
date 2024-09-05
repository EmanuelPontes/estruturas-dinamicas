import { FormField } from "./form-field.model";

export class SearchField extends FormField<any> {
    override controlType = "search";
}