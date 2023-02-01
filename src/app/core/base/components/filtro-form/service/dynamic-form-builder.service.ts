import { Injectable } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { DateField } from "../model/date-field.model";
import { DropdownField } from "../model/dropdown-field.model";
import { FormField } from "../model/form-field.model";
import { TextField } from "../model/text-field.model";
import { TimeField } from "../model/time-field.model";

@Injectable()
export class DynamicFormBuilderService {


    /**
     * 
     */
    getFields(): Observable<FormField<any>[]> {
        
        const fields: FormField<any>[] = [
            new DateField({
                key: 'data',
                label: 'Data Inicio',
                value: new Date (Date.now()),
                order: 1
            }),
            new DropdownField({
                key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
            }),
            new TextField({key: 'firstName',
            label: 'First name',
            value: 'Bombasto',
            required: true,
            order: 2}),
            new TimeField({
                key: 'hora',
                label: 'Hora Inicio',
                value: '12:00',
            }),
        ];
        
        return of(fields.sort((a, b) => a.order - b.order));
    }

    objecToFormFieldArray(obj: any) {
        let formArr: FormField<any>[] = [];
        let count = 0;
        for (const [key, value] of Object.entries(obj)) {
            if (Object.prototype.toString.call(value) === '[object Date]') {
                formArr.push(
                    new DateField({
                        key: key,
                        label: key,
                        value: value as Date,
                        order: count
                    }),
                )
            } else {
                formArr.push(
                    new TextField({key: key,
                        label: key,
                    value: value as string,
                    required: false,
                    order: count})
                );
            }

            

            count++;
        
        }

        return formArr;
    }
    /**
     * 
     */
    public toFormGoup(
        fields: FormField<any>[]
    ): FormGroup {

        const group: any = {}

        fields.forEach(field => {
            group[field.key] = field.required ?
            new FormControl(field.value || '', Validators.required) :
            new FormControl(field.value || '');
        })

        return new FormGroup(group);
    }
}