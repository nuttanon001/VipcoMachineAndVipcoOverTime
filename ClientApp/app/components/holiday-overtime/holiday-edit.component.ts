// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

// models
import { HolidayOverTime } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { HolidayOverTimeService, HolidayOverTimeServiceCommunicate } from "../../services/overtime-master/holiday-overtime.service";

@Component({
    selector: "holiday-edit",
    templateUrl: "./holiday-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})

// holiday-edit component*/
export class HolidayEditComponent
    extends BaseEditComponent<HolidayOverTime, HolidayOverTimeService>
{
    /** holiday-edit ctor */
    constructor(
        service: HolidayOverTimeService,
        serviceCom: HolidayOverTimeServiceCommunicate,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: HolidayOverTime): void {
        if (value) {
            this.service.getOneKeyNumber(value.HolidayId)
                .subscribe(dbData => {
                    this.editValue = dbData;
                    // Set Date
                    if (this.editValue.HolidayDate) {
                        this.editValue.HolidayDate = this.editValue.HolidayDate != null ?
                            new Date(this.editValue.HolidayDate) : new Date();
                    }
                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                HolidayId: 0,
                HolidayStatus: 1
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            HolidayId: [this.editValue.HolidayId],
            HolidayName: [this.editValue.HolidayName,
                [
                    Validators.required,
                    Validators.maxLength(200),
                ]
            ],
            HolidayDate: [this.editValue.HolidayDate,
                [
                    Validators.required,
                ]
            ],
            HolidayStatus: [this.editValue.HolidayStatus],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }
}