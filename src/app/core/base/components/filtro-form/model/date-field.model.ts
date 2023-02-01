import { FormField } from "./form-field.model";

export class DateField extends FormField<Date> {
    override controlType = "date";
    override type = "date";
}