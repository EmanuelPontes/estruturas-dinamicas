import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { isArray, isObject } from "../../../functions/util";
import { checkPasswords } from "../../../functions/validators/checkPasswords";
import { DateField } from "../model/date-field.model";
import { DropdownField } from "../model/dropdown-field.model";
import { FormField } from "../model/form-field.model";
import { SearchField } from "../model/search-field.model";
import { TableField } from "../model/table-field.model";
import { TextField } from "../model/text-field.model";
import { TimeField } from "../model/time-field.model";

@Injectable()
export class DynamicFormBuilderService {
    
    
    
    fillExistingForm(objectForm: FormField<any>[], data: any, options?: {key: string, readonly: boolean, required: boolean}[]) {
        for (const [key, value] of Object.entries(data)) {
            let field = objectForm.find(field => field.key === key)
            if (!field) {

                if(key === 'id') {
                    objectForm.unshift(
                        new TextField({key: key,
                            label: 'Id',
                            value: value as string,
                            required: true,
                            order: 1}),
                    )
                } 
                continue;

                
            }
            field.value = value;
            if (options) {
                let opt = options.find(opt => opt.key === key)
                
                field.readonly = opt?.readonly;
                field.required = opt?.required;
            }
        }

        return objectForm;
    }


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
            new TableField({key: 'array',
                label: 'array',
            value: [{a: '', b: '', c: ''}],
            required: false,
            order: 3})
        ];
        
        return of(fields.sort((a, b) => a.order - b.order));
    }

    objecToFormFieldArray(obj: any) {
        let formArr: FormField<any>[] = [];
        let count = 0;
        for (const [key, value] of Object.entries(obj)) {
            console.log("Obj to form: " + Object.prototype.toString.call(value));
            if (Object.prototype.toString.call(value) === '[object Date]') {
                formArr.push(
                    new DateField({
                        key: key,
                        label: key[0].toUpperCase() + key.substring(1),
                        value: value as Date,
                        order: count
                    }),
                )
            }

            else if (isObject(value)) {
                
                formArr.push(
                    new SearchField({
                        key: key,
                        label: key[0].toUpperCase() + key.substring(1),
                        value: value as any,
                        order: count
                    }),
                )
            }
            else if (isArray(value)) {
                formArr.push(
                    new TableField({key: key,
                        label: key[0].toUpperCase() + key.substring(1),
                    value: value as [],
                    required: false,
                    order: count})
                );
            }
            else {
                formArr.push(
                    new TextField({key: key,
                        label: key[0].toUpperCase() + key.substring(1),
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

            if (field.controlType === 'table') {
                group[field.key] = new FormArray(
                    field.value.map((value: any) => {
                        //revisar from entries
                        return new FormGroup(
                            {...Object.fromEntries(Object.entries(value).map(([k, v]) => {
                                return [k, new FormControl(v !== undefined && v !== null ? v : '')];
                            })), ...{
                                action: new FormControl('existingRecord'),
                                isEditable: new FormControl(true),
                            }}
                            // Object.keys(value).reduce((result, k) => {
                            //     result[k] = new FormControl(value[k] || ''); 
                            //     return  result;
                            // }, obj)
                        )
                        }
                    )
                )
            } else {
                group[field.key] = field.required ?
                new FormControl(field.value || '', Validators.required) :
                new FormControl(field.value || '');
            }
            
        })
        if (fields.find((f: any) => f.key == "confirmaSenha") ) {
            return new FormGroup(group,[checkPasswords]);
        } else {
            return new FormGroup(group,[]);
        }
        
    }
}