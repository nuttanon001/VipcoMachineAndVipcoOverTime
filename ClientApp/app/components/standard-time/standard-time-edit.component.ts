// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

// models
import { TypeStandardTime, StandardTime } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { TypeStandardTimeService, TypeStandardTimeServiceCommunicate } from "../../services/type-standard-time/type-standard-time.service";
import { StandardTimeService } from "../../services/standard-time/standard-time.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
// primeng
import { SelectItem } from "primeng/primeng";
// 3rdParty
import { TableColumn } from "@swimlane/ngx-datatable"

@Component({
    selector: "standard-time-edit",
    templateUrl: "./standard-time-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** standard-time-edit component*/
export class StandardTimeEditComponent
    extends BaseEditComponent<TypeStandardTime, TypeStandardTimeService>
{
    machineTypes: Array<SelectItem>;
    /** standard-time-edit ctor */
    constructor(
        service: TypeStandardTimeService,
        serviceCom: TypeStandardTimeServiceCommunicate,
        private viewContainerRef: ViewContainerRef,
        private serviceStandardTime: StandardTimeService,
        private serviceMachineType: TypeMachineService,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: TypeStandardTime): void {
        if (value) {
            this.service.getOneKeyNumber(value.TypeStandardTimeId)
                .subscribe(dbData => {
                    this.editValue = dbData;

                    if (this.editValue.TypeStandardTimeId) {
                        this.serviceStandardTime.getByMasterId(this.editValue.TypeStandardTimeId)
                            .subscribe(dbStandards => {
                                this.editValue.StandardTimes = dbStandards.slice();
                                this.editValueForm.patchValue({
                                    StandardTimes: this.editValue.StandardTimes.slice(),
                                });
                            });
                    }
                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                TypeStandardTimeId: 0
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();

        // MachineType ComboBox
        this.serviceMachineType.getAll()
            .subscribe(dbTypeMachines => {
                this.machineTypes = new Array;
                this.machineTypes.push({ label: "-", value: undefined });
                for (let item of dbTypeMachines) {
                    this.machineTypes.push({ label: `${(item.TypeMachineCode || "")} ${(item.Name || "")}`, value: item.TypeMachineId });
                }
            }, error => console.error(error));
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            TypeStandardTimeId: [this.editValue.TypeStandardTimeId],
            Name: [this.editValue.Name,
                [
                    Validators.required,
                    Validators.maxLength(50),
                ]
            ],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            TypeMachineId: [this.editValue.TypeMachineId,
                [
                    Validators.required
                ]
            ],
            StandardTimes: [this.editValue.StandardTimes]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));


    }

    // new StandardTime
    onNewStandardTime() {
        let standard: StandardTime = {
            StandardTimeId: 0
        };

        this.serviceDialogs.dialogNewEditStandardTime(this.viewContainerRef, standard)
            .subscribe(resultStandard => {
                if (resultStandard) {
                    if (this.editValue.TypeStandardTimeId) {
                        resultStandard.TypeStandardTimeId = this.editValue.TypeStandardTimeId;
                    }

                    if (!this.editValue.StandardTimes) {
                        this.editValue.StandardTimes = new Array;
                    }

                    if (this.editValue.StandardTimes) {
                        // cloning an object
                        this.editValue.StandardTimes.push(Object.assign({}, resultStandard));
                        this.editValueForm.patchValue({
                            StandardTimes: this.editValue.StandardTimes.slice(),
                        });
                    }
                }
            });
    }

    // edit StandardTime
    onEditStandardTime(standard: StandardTime) {

        if (standard && this.editValue.StandardTimes) {
            let index: number = this.editValue.StandardTimes.indexOf(standard)
            if (index > -1) {
                this.serviceDialogs.dialogNewEditStandardTime(this.viewContainerRef, standard)
                    .subscribe(resultStandard => {
                        if (resultStandard && this.editValue.StandardTimes) {
                            // remove item
                            this.editValue.StandardTimes.splice(index, 1);
                            // cloning an object
                            this.editValue.StandardTimes.push(Object.assign({}, resultStandard));
                            this.editValueForm.patchValue({
                                StandardTimes: this.editValue.StandardTimes.slice(),
                            });
                        }
                    });
            }
        }
    }

    // remove StandardTime
    onRemoveStandardTime(standard: StandardTime) {
        if (standard && this.editValue.StandardTimes) {
            if (standard.StandardTimeId > 0) {
                this.serviceDialogs.error("Deny Action", "ข้อมูลมีการอ้างอิงถึงระบบไม่สามารถให้การกระทำนี้มีผลต่อระบบได้.", this.viewContainerRef);
                return;
            }

            let index: number = this.editValue.StandardTimes.indexOf(standard)
            if (index > -1) {
                // remove item
                this.editValue.StandardTimes.splice(index, 1);
                this.editValue.StandardTimes = [...this.editValue.StandardTimes];
                // cloning an object
                this.editValueForm.patchValue({
                    StandardTimes: this.editValue.StandardTimes.slice(),
                });
            }
        }
    }
}