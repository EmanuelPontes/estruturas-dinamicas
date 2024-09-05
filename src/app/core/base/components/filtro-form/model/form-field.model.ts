export class FormField<T> {
    
    value: T | undefined;
    multi: boolean = false;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    type: string;
    readonly: boolean;
    options: {key: string; value:string}[];


    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;
        order?: number;
        controlType?: string;
        type?: string;
        multi?: boolean;
        readonly?: boolean;
        options?: {key: string, value: string}[];
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || 'text';
      this.readonly = options.readonly || false;
      this.options = options.options || [];
      this.multi = options.multi || false;
    }


}