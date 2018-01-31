import { Component, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ValidationService } from "../../services/service.index";

@Component({
    selector: "validation-messages",
    template:
`
    <div class="alert alert-danger text-danger my-0 py-0" *ngIf="errorMessage !== null">
        {{errorMessage}}
    </div>
`
})
export class ValidationComponent {
    @Input("control") control: FormControl;
    constructor(private validation:ValidationService) { }

    get errorMessage() {
        if (this.control && this.control.errors) {
            for (let propertyName in this.control.errors) {
                if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                    return this.validation.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
                }
            }
        }
        return null;
    }
}