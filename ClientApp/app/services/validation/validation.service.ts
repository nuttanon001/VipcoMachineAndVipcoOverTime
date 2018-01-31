import { Injectable } from "@angular/core";
// Classes
import { FormErrors,ValidationResult } from "../../models/model.index";

@Injectable()
export class ValidationService {
    getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config: FormErrors = {
            "required": "Required field.",
            "invalidCreditCard": "Is invalid credit card number.",
            "invalidEmailAddress": "Invalid email address.",
            "invalidPassword": "Invalid password. Password must be at least 6 characters long, and contain a number.",
            "minlength": `Must be at least ${validatorValue.requiredLength} characters long.`,
            "maxlength": `Cannot be more than ${validatorValue.requiredLength} characters long.Maximun length`
        };

        return config[validatorName];
    }

    creditCardValidator(control: any): ValidationResult|null {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
            return null;
        } else {
            let validatorResult: ValidationResult = {"invalidCreditCard":true}
            return validatorResult;
        }
    }

    emailValidator(control: any): ValidationResult | null {
        // RFC 2822 compliant regex
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            let validatorResult: ValidationResult = { "invalidEmailAddress": true }
            return validatorResult;
        }
    }

    passwordValidator(control: any): ValidationResult | null {
        // {6,100}           - Assert password is between 6 and 100 characters
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            let validatorResult: ValidationResult = { "invalidPassword": true }
            return validatorResult;
        }
    }
}