import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const contactsValidatorDirective = (validator: ValidatorFn, controls: string[] = []) => (
    group: FormGroup,
): ValidationErrors | null => {
    if(!controls) {
        controls = Object.keys(group.controls)
    }

    const hasOneContact = 
        group && group.controls && controls.some( k=>!validator(group.controls[k]) );
    
    return hasOneContact ? null : { oneContact: true };

};
/*@Injectable({providedIn: 'root'})
export class ContactsValidator {
    public emailPhoneContact(...controls: string[]) : ValidatorFn {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        return (control: AbstractControl): ValidationErrors | null => {
            return (control.value.phone && control.value.email) ||
               (!control.value.phone && !control.value.email) 
                  ? { emailAndPhoneError : true } 
                  : null;
        };
    }
}*/
