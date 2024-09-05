import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";
import { DadosOrigemTabela } from "../../apres-table/model/dados-origem-tabela.model";

export class TabelaForm {
    private VOForm: FormGroup = new FormGroup(
        {
            VORoms: new FormArray([])
        }
    );

    private _displayedColumns: string[] = []; 
    public cabecalho: string[] = [];
    public readonlyKeys: string[] = [];
    public isSelectEnable: boolean = false;
    constructor(objects: any[], readonlyKeys?: string[], isSelectEnable?: boolean ) {
        
        this.criarLinhaEColunasFromObj(readonlyKeys, objects, isSelectEnable);
        
    }

    private criarLinhaEColunasFromObj(readonlyKeys: string[], objects: any[], isSelectEnable: boolean) {
        if (readonlyKeys) {
            this.readonlyKeys = readonlyKeys;
        }
        if (objects.length > 0) {
            this._displayedColumns = Object.keys(objects[0]).filter(k => k !== 'id');
            if (isSelectEnable) {
                this._displayedColumns.unshift('select');
            }

            this._displayedColumns.push('action');
            this.VOForm = new FormGroup(

                {
                    VORoms: new FormArray(
                        objects.map((value: any) => {
                            //review fromEntries 
                            return new FormGroup(
                                {
                                    ...Object.fromEntries(Object.entries(value).map(([k, v]) => {
                                        return [k, new FormControl(v !== undefined && v !== null ? v : '')];
                                    })), ...{
                                        action: new FormControl('existingRecord'),
                                        isEditable: new FormControl(true),
                                    }
                                }
                                // Object.keys(value).reduce((result, k) => {
                                //     result[k] = new FormControl(value[k] || ''); 
                                //     return  result;
                                // }, obj)
                            );
                        }
                        )
                    )
                }
            );

            this.cabecalho = Object.keys(objects[0]).filter(k => k !== 'id').map(key => {
                let str = !key.toLowerCase().startsWith("ca") ? key.replace("ca", "çã") : key;
                str = str[0].toUpperCase() + str.substring(1);
                return str.split(/(?=[A-Z])/).join(" ");
            });
        }
    }

    private criarLinhaEColunas(readonlyKeys: string[], objects: DadosOrigemTabela[], isSelectEnable: boolean) {
        if (readonlyKeys) {
            this.readonlyKeys = readonlyKeys;
        }
        if (objects.length > 0) {
            this._displayedColumns = Object.keys(objects[0].objeto).filter(k => k !== 'id');
            if (isSelectEnable) {
                this._displayedColumns.unshift('select');
            }

            this._displayedColumns.push('action');
            this.VOForm = new FormGroup(

                {
                    VORoms: new FormArray(
                        objects.map((value: DadosOrigemTabela) => {
                            let obj: any = {};
                            return new FormGroup(
                                {
                                    ...Object.fromEntries(Object.entries(value.objeto).map(([k, v]) => {
                                        return [k, new FormControl(v !== undefined && v !== null ? v : '')];
                                    })), ...{
                                        action: new FormControl('existingRecord'),
                                        isEditable: new FormControl(true),
                                    }
                                }
                                // Object.keys(value).reduce((result, k) => {
                                //     result[k] = new FormControl(value[k] || ''); 
                                //     return  result;
                                // }, obj)
                            );
                        }
                        )
                    )
                }
            );

            this.cabecalho = Object.keys(objects[0].objeto).filter(k => k !== 'id').map(key => {
                let str = !key.toLowerCase().startsWith("ca") ? key.replace("ca", "çã") : key;
                str = str[0].toUpperCase() + str.substring(1);
                return str.split(/(?=[A-Z])/).join(" ");
            });
        }
    }

    public adicionarMaisLinhas(objects: any[]) {
        if (objects.length > 0) {
            
            for (let i = 0; i < objects.length; i++) {
                this.VORoms.push(new FormGroup(
                    {
                        ...Object.fromEntries(Object.entries(objects[i]).map(([k, v]) => {
                            return [k, new FormControl(v !== undefined && v !== null ? v : '')];
                        })), ...{
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                        }
                    }
                ))
            }
        }
    }

    get VORoms() {
        return this.VOForm.get('VORoms') as FormArray;
    }

    get form() {
        return this.VOForm;
    }

    get linhas () {
        return (this.VOForm.get('VORoms') as FormArray).controls;
    }

    set linhas (value: AbstractControl[]) {
        this.VOForm.get('VORoms').setValue(value.map(v => v.value));
    }

    get displayedColumns() {
        return this._displayedColumns
    }
}
