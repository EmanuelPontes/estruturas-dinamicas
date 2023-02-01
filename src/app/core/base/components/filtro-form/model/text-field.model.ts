import { FormField } from "./form-field.model";

export class TextField extends FormField<string> {
    override controlType = "text";
}