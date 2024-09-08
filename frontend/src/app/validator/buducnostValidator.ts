import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function buducnostValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const sad = new Date();
        const inputDatum = new Date(control.value);

        if (control.value && inputDatum <= sad) {
            return { buducnost: true };
        }
        return null;
    };
}