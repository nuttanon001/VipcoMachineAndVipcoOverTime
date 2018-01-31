import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ValidationComponent } from "../../components/validation/validation.componet";
import { ValidationService } from "../../services/service.index";

@NgModule({
    declarations: [
        ValidationComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ValidationComponent,
    ],
    providers: [ValidationService],
    entryComponents: [
        ValidationComponent,
    ]
})
export class ValidationModule { }