// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

// models
import { Machine, MachineHasOperator } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { MachineService, MachineServiceCommunicate } from "../../services/machine/machine.service";
import { MachineHasOperatorService } from "../../services/machine-has-operator/machine-has-operator.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
import { EmployeeService } from "../../services/employee/employee.service";
// primeng
import { SelectItem } from "primeng/primeng";
// 3rdParty
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: 'machine-edit',
    templateUrl: './machine-edit.component.html',
    styleUrls: ["../../styles/edit.style.scss"],
})
/** machine-edit component*/
export class MachineEditComponent
    extends BaseEditComponent<Machine, MachineService>
{
    @ViewChild("ImageFile") ImageFile: any;
    machineTypes: Array<SelectItem>;

    /** machine-edit ctor */
    constructor(
        service: MachineService,
        serviceCom: MachineServiceCommunicate,
        private viewContainerRef: ViewContainerRef,
        private serviceOperator: MachineHasOperatorService,
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
    onGetDataByKey(value?: Machine): void {
        if (value) {
            this.service.getOneKeyNumber(value.MachineId)
                .subscribe(dbData => {
                    this.editValue = dbData;
                    // Set Date
                    if (this.editValue.InstalledDate) {
                        this.editValue.InstalledDate = this.editValue.InstalledDate != null ?
                            new Date(this.editValue.InstalledDate) : new Date();
                    }

                    if (this.editValue.MachineId) {
                        this.serviceOperator.getByMasterId(this.editValue.MachineId)
                            .subscribe(dbOperator => {
                                this.editValue.MachineHasOperators = dbOperator.slice();
                                this.editValueForm.patchValue({
                                    MachineHasOperators: this.editValue.MachineHasOperators.slice(),
                                });
                            });
                    }

                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                MachineId: 0
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
            MachineId: [this.editValue.MachineId],
            MachineCode: [this.editValue.MachineCode,
                [
                    Validators.required,
                    Validators.maxLength(50),
                ]
            ],
            MachineName: [this.editValue.MachineName,
                [
                    Validators.maxLength(200),
                ]
            ],
            InstalledDate: [this.editValue.InstalledDate],
            Model: [this.editValue.Model,
                [
                    Validators.maxLength(50),
                ]
            ],
            Brand: [this.editValue.Brand,
                [
                    Validators.maxLength(50),
                ]
            ],
            Remark: [this.editValue.Remark,
                [
                    Validators.maxLength(200),
                ]
            ],
            MachineImage: [this.editValue.MachineImage],
            MachineImageString: [this.editValue.MachineImageString],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            TypeMachineId: [this.editValue.TypeMachineId,
                [
                    Validators.required
                ]
            ],
            MachineHasOperators: [this.editValue.MachineHasOperators]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

    }

    // new Detail
    onNewOperatore() {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
            .subscribe(employees => {
                if (employees) {
                    employees.forEach(item => {
                        let operator: MachineHasOperator = {
                            MachineOperatorId: 0,
                            EmpCode: item.EmpCode,
                            EmployeeName: item.NameThai,
                        };
                        //Set MasterId
                        if (this.editValue.MachineId) {
                            operator.MachineId = this.editValue.MachineId;
                        }
                        //If array is null
                        if (!this.editValue.MachineHasOperators) {
                            this.editValue.MachineHasOperators = new Array;
                        }

                        if (this.editValue.MachineHasOperators) {
                            if (!this.editValue.MachineHasOperators.find(item2 => item2.EmpCode == item.EmpCode)) {
                                // cloning an object
                                this.editValue.MachineHasOperators.push(Object.assign({}, operator));
                                this.editValueForm.patchValue({
                                    MachineHasOperators: this.editValue.MachineHasOperators.slice(),
                                });
                            }
                        }
                    });
                }
            });
    }

    // remove Detail
    onRemoveOperatore(operator: MachineHasOperator) {
        if (operator && this.editValue.MachineHasOperators) {
            let index: number = this.editValue.MachineHasOperators.indexOf(operator);
            if (index > -1) {
                // remove item
                this.editValue.MachineHasOperators.splice(index, 1);
                this.editValue.MachineHasOperators = [...this.editValue.MachineHasOperators];
                // cloning an object
                this.editValueForm.patchValue({
                    MachineHasOperators: this.editValue.MachineHasOperators.slice(),
                });
            }
        }
    }

    // image Change
    onFileChange($event:any): void {
        let file = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
        let pattern = /image/;
        // debug here
        // console.log(file.type);
        if (!file.type.match(pattern)) {
            this.ImageFile.nativeElement.value = "";
            this.serviceDialogs.error("ไม่เข้าเงื่อนไข", "ระบบบันทึกเฉพาะไฟล์รูปภาพเท่านั้น !!!", this.viewContainerRef);
            return;
        } else {
            this.readImageFileToString64($event.target);
        }
    }

    // convert image to string
    readImageFileToString64(inputValue: any): void {
        var file: File = inputValue.files[0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.editValueForm.patchValue({ MachineImageString: myReader.result });
        };
        myReader.readAsDataURL(file);
    }
}