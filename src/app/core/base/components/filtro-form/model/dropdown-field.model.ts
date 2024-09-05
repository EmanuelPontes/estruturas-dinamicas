import { FormField } from "./form-field.model";

export class DropdownField extends FormField<string> {
    override controlType = "dropdown";
    
}