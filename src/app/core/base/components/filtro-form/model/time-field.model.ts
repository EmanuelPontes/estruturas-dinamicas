import { FormField } from "./form-field.model"

export class TimeField extends FormField<string> {
    override controlType = "time";
    override type = "time";
}