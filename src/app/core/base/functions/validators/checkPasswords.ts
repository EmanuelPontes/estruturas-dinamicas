import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";

export function checkPasswords(group: AbstractControl):  ValidationErrors | null {
    let pass = group.get('senha').value;
        let confirmPass = group.get('confirmaSenha').value
        return pass === confirmPass ? null : { notSame: true }
}

