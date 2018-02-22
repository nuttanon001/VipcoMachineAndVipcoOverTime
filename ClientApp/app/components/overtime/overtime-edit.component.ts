// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
// models
import {
    OverTimeMaster, OverTimeDetail,
    Employee, ProjectCodeMaster,
    OptionOverTimeLast
} from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { OverTimeMasterService,OverTimeMasterServiceCommunicate } from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
import { AuthService } from "../../services/auth/auth.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "overtime-edit",
    templateUrl: "./overtime-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// overtime-edit component*/
export class OvertimeEditComponent
    extends BaseEditComponent<OverTimeMaster, OverTimeMasterService> {
    lastOverTimeMaster?: OverTimeMaster;
    overtimeDetail?: OverTimeDetail;
    optionLastOver?: OptionOverTimeLast;
    indexOverTimeDetail: number;
    lockSave: boolean = false;
    showWorkGroupMis: boolean = false;
    showStartOT: boolean = false;
    defaultHour: number;
    canNotSave: string = "";
    // propertity
    get CanEditInRequiredOnly(): boolean {
        if (this.editValue) {
            if (this.editValue.OverTimeStatus) {
                return this.editValue.OverTimeStatus !== 1;
            }
        }
        return false;
    }

    // overtime-edit ctor */
    constructor(
        service: OverTimeMasterService,
        serviceCom: OverTimeMasterServiceCommunicate,
        private serviceDialogs: DialogsService,
        private serviceDetail: OverTimeDetailService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private serviceAuth: AuthService
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: OverTimeMaster): void {
        this.defaultHour = 4;
        this.lastOverTimeMaster = undefined;

        if (value) {
            this.service.getOneKeyNumber(value.OverTimeMasterId)
                .subscribe(dbJobCardMaster => {
                    this.editValue = dbJobCardMaster;
                    // set Date
                    if (this.editValue.OverTimeDate) {
                        this.editValue.OverTimeDate = this.editValue.OverTimeDate != null ?
                            new Date(this.editValue.OverTimeDate) : new Date();
                    }
                    if (this.editValue.OverTimeMasterId) {
                        this.serviceDetail.getByMasterId(this.editValue.OverTimeMasterId)
                            .subscribe(dbDetail => {
                                this.editValue.OverTimeDetails = [...dbDetail];
                                this.editValueForm.patchValue({
                                    OverTimeDetails: this.editValue.OverTimeDetails.slice(),
                                });
                            });
                    }
                    // group Mis
                    if (this.editValue.GroupMIS) {
                        this.showWorkGroupMis = true;
                    } else {
                        this.showWorkGroupMis = false;
                    }
                    // get LastOverTime
                    if (this.editValue.LastOverTimeId) {
                        this.service.getOneKeyNumber(this.editValue.LastOverTimeId)
                            .subscribe(dbLastMaster => {
                                this.lastOverTimeMaster = dbLastMaster;
                                if (this.lastOverTimeMaster) {
                                    if (this.lastOverTimeMaster.OverTimeStatus) {
                                        if (this.lastOverTimeMaster.OverTimeStatus !== 3) {
                                            this.canNotSave = "Last OverTime was Incompleted. This overtime can't save.";
                                            this.serviceDialogs.error("Error Message",
                                                "Last OverTime was Incompleted. This overtime can't save.",
                                                this.viewContainerRef);
                                        }
                                    }
                                }
                            });
                    }
                }, error => console.error(error), () => this.defineData());
        } else {
            this.showWorkGroupMis = false;

            this.editValue = {
                OverTimeMasterId: 0,
                OverTimeStatus: 1,
                OverTimeDate: new Date(),
            };

            if (this.serviceAuth.getAuth) {
                this.editValue.EmpRequire = this.serviceAuth.getAuth.EmpCode || "";
                this.editValue.RequireString = this.serviceAuth.getAuth.NameThai || "";
            }

            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();
        this.overtimeDetail = undefined;
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            OverTimeMasterId: [this.editValue.OverTimeMasterId],
            OverTimeDate: [this.editValue.OverTimeDate],
            InfoPlan: [this.editValue.InfoPlan,
                [
                    Validators.maxLength(500),
                    Validators.required,
                ],
            ],
            InfoActual: [this.editValue.InfoActual,
                [
                    Validators.maxLength(500),
                ]
            ],
            OverTimeStatus: [this.editValue.OverTimeStatus],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            // fK
            EmpApprove: [this.editValue.EmpApprove],
            EmpRequire: [this.editValue.EmpRequire],
            LastOverTimeId: [this.editValue.LastOverTimeId],
            GroupCode: [this.editValue.GroupCode],
            GroupMIS: [this.editValue.GroupMIS,
                [
                    Validators.required
                ]
            ],
            ProjectCodeMasterId: [this.editValue.ProjectCodeMasterId,
                [
                    Validators.required
                ]
            ],
            OverTimeDetails: [this.editValue.OverTimeDetails],
            // viewModel
            ApproveString: [this.editValue.ApproveString],
            RequireString: [this.editValue.RequireString],
            GroupString: [this.editValue.GroupString],
            GroupMisString: [this.editValue.GroupMisString,
                [
                    Validators.required
                ]
            ],
            ProjectMasterString: [this.editValue.ProjectMasterString,
                [
                    Validators.required
                ]
            ],
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

        if (this.CanEditInRequiredOnly) {
            const form: FormGroup = this.editValueForm;
            const controlDate: AbstractControl | null = form.get("OverTimeDate");

            if (controlDate) {
                controlDate.disable();
            }
        }
    }

    // onValueChanged Override
    onValueChanged(data?: any): void {
        if (!this.editValueForm) {
            return;
        }

        const form: FormGroup = this.editValueForm;
        const controlMaster: AbstractControl | null = form.get("ProjectCodeMasterId");
        // const controlGroup: AbstractControl | null = form.get("GroupCode");
        const controlDate: AbstractControl | null = form.get("OverTimeDate");
        const controlMis: AbstractControl | null = form.get("GroupMIS");

        if (controlMis) {
            let valueMis: string = controlMis.value;
            this.showStartOT = valueMis.indexOf("000005") !== -1;
        }

        if (this.editValue.OverTimeStatus === 1) {
            if (controlMaster && controlMis) {
                if (controlMaster.value && controlMis.value) {
                    // check if alrady have last overtime master check if don't same get new last over time master
                    let byPass: boolean = false;
                    if (!this.optionLastOver) {
                        this.optionLastOver = {
                            CurrentOverTimeId: this.editValue.OverTimeMasterId,
                            // GroupCode: controlGroup.value,
                            ProjectCodeId: controlMaster.value,
                            GroupMis: controlMis !== null ? controlMis.value : undefined
                        };
                        if (controlDate) {
                            this.optionLastOver.BeForDate = controlDate.value;
                        }
                        byPass = true;
                    }

                    if (this.optionLastOver) {
                        if (!byPass) {
                            // let strGroup:any = controlGroup.value;
                            let strPro: any = controlMaster.value;
                            let strMis: any = controlMis !== null ? controlMis.value : undefined;

                            if (controlDate) {
                                // console.log("By OptionLastOver:", this.optionLastOver);
                                // console.log("By Control:", strGroup, strPro, controlDate.value);

                                if (this.optionLastOver.ProjectCodeId === strPro &&
                                    this.optionLastOver.BeForDate === controlDate.value &&
                                    this.optionLastOver.GroupMis === strMis) {
                                    byPass = false;
                                } else {
                                    byPass = true;
                                }
                            } else {
                                if (this.optionLastOver.ProjectCodeId === strPro &&
                                    this.optionLastOver.GroupMis === strMis) {
                                    byPass = false;
                                } else {
                                    byPass = true;
                                }
                            }
                        }
                        // console.log("By Pass:", byPass);

                        if (byPass) {

                            let strMis: any = controlMis !== null ? controlMis.value : undefined;

                            this.optionLastOver = {
                                CurrentOverTimeId: this.editValue.OverTimeMasterId,
                                ProjectCodeId: controlMaster.value,
                                GroupMis: controlMis !== null ? controlMis.value : undefined
                            };
                            if (controlDate) {
                                this.optionLastOver.BeForDate = controlDate.value;
                            }

                            this.service.getlastOverTimeMasterV3(this.optionLastOver)
                                .subscribe(lastMaster => {
                                    // console.log("LastMaster", lastMaster);
                                    if (lastMaster) {
                                        this.lastOverTimeMaster = lastMaster;
                                        this.editValueForm.patchValue({
                                            LastOverTimeId: lastMaster.OverTimeMasterId,
                                        });
                                        this.canNotSave = "";
                                        if (lastMaster.OverTimeStatus !== 3) {
                                            // if (strMis) {
                                            //    this.canNotSave = "";
                                            // } else {
                                            //    this.canNotSave = "Last OverTime was Incompleted. This overtime can't save.";
                                            //    this.serviceDialogs.error("Error Message",
                                            //        "Last OverTime was Incompleted. This overtime can't save.",
                                            //        this.viewContainerRef);
                                            // }
                                            this.canNotSave = "Last OverTime was Incompleted. This overtime can't save.";
                                            this.serviceDialogs.error("Error Message",
                                                "Last OverTime was Incompleted. This overtime can't save.",
                                                this.viewContainerRef);
                                        }
                                    } else {
                                        this.lastOverTimeMaster = {
                                            OverTimeMasterId: 0,
                                            OverTimeDate: new Date(),
                                            ProjectCodeMasterId: controlMaster.value
                                        };

                                        this.editValueForm.patchValue({
                                            LastOverTimeId: undefined,
                                        });
                                    }
                                }, error => {
                                    this.canNotSave = "";
                                    this.lastOverTimeMaster = {
                                        OverTimeMasterId: 0,
                                        OverTimeDate: new Date(),
                                        ProjectCodeMasterId: controlMaster.value
                                    };
                                    this.editValueForm.patchValue({
                                        LastOverTimeId: undefined,
                                    });
                                });
                        }
                    }
                }
            }
        }

        super.onValueChanged();
    }

    // new Detail
    onChooseEmployeeToOverTime(mode?:number): void {
        if (this.CanEditInRequiredOnly) {
            this.onCanEditInRequiredOnly();
            return;
        }

        if (mode) {
            const form: FormGroup = this.editValueForm;

            if (mode === 1) {
                const controlGroup: AbstractControl | null = form.get("GroupCode");

                let group: string = "";
                if (controlGroup) {
                    if (controlGroup.value) {
                        group = controlGroup.value;
                    }
                }

                this.serviceDialogs.dialogSelectEmployeeWithGroup(this.viewContainerRef, group)
                    .subscribe(selectEmpoyee => {
                        if (selectEmpoyee) {
                            this.addEmployeeDetailToOverTime(selectEmpoyee);
                        }
                    });
            } else {
                const controlGroupMis: AbstractControl | null = form.get("GroupMIS");

                let groupMis: string = "";
                if (controlGroupMis) {
                    if (controlGroupMis.value) {
                        groupMis = controlGroupMis.value;
                    }
                }

                this.serviceDialogs.dialogSelectEmployeeWithGroupMis(this.viewContainerRef, groupMis)
                    .subscribe(selectEmpoyee => {
                        if (selectEmpoyee) {
                            this.addEmployeeDetailToOverTime(selectEmpoyee);
                        }
                    });
            }
        }
    }

    // add Employee Detail
    addEmployeeDetailToOverTime(listEmployee: Array<Employee>): void {
        if (listEmployee) {
            listEmployee.forEach(item => {
                let detail: OverTimeDetail = {
                    OverTimeDetailId: 0,
                    EmpCode: item.EmpCode,
                    EmployeeString: item.NameThai,
                    TotalHour: this.defaultHour,
                    OverTimeDetailStatus: 1,
                    StatusString: "Use",
                    OverTimeMasterId: this.editValue.OverTimeMasterId
                };
                // if array is null
                if (!this.editValue.OverTimeDetails) {
                    this.editValue.OverTimeDetails = new Array;
                }

                if (this.editValue.OverTimeDetails) {
                    if (!this.editValue.OverTimeDetails.find(item2 => item2.EmpCode === item.EmpCode)) {
                        // cloning an object
                        this.editValue.OverTimeDetails.push(Object.assign({}, detail));
                        this.editValueForm.patchValue({
                            OverTimeDetails: this.editValue.OverTimeDetails.slice(),
                        });
                    }
                }
            });
        }
    }

    // remove Detail
    onRemoveOverTimeDetailOrCancelOverTimeDetail(detail?: OverTimeDetail,cencel:number = 0): void {
        if (this.CanEditInRequiredOnly) {
            this.onCanEditInRequiredOnly();
            return;
        }

        if (detail && this.editValue.OverTimeDetails) {
            // find id
            let index: number = this.editValue.OverTimeDetails.indexOf(detail);

            if (index > -1) {
                if (detail.OverTimeDetailId < 1) {
                    if (index > -1) {
                        // remove item
                        this.editValue.OverTimeDetails.splice(index, 1);
                    }
                } else {
                    const editJobDetail: OverTimeDetail | undefined = this.editValue.OverTimeDetails
                        .find((value, index) => value.OverTimeDetailId === detail.OverTimeDetailId);

                    if (editJobDetail) {
                        if (cencel === 1) {
                            editJobDetail.OverTimeDetailStatus = 1;
                            editJobDetail.StatusString = "Use";
                        } else {
                            editJobDetail.OverTimeDetailStatus = 2;
                            editJobDetail.StatusString = "Cancel";
                        }
                    }
                }

                // update array
                this.editValue.OverTimeDetails = this.editValue.OverTimeDetails.slice();
                // cloning an object
                this.editValueForm.patchValue({
                    JobCardDetails: this.editValue.OverTimeDetails.slice(),
                });
            }
        }
    }

    // on ProjectDetail click
    onProjectMasterClick(): void {
        if (this.CanEditInRequiredOnly) {
            this.onCanEditInRequiredOnly();

            return;
        }

        this.serviceDialogs.dialogSelectedMaster(this.viewContainerRef)
            .subscribe(resultMaster => {
                if (resultMaster) {
                    this.editValueForm.patchValue({
                        ProjectMasterString: `${resultMaster.ProjectCode}/${resultMaster.ProjectName}`,
                        ProjectCodeMasterId: resultMaster.ProjectCodeMasterId,
                    });
                }
            });
    }

    // on Employee Group Click
    onEmployeeGroupClick(): void {
        if (this.CanEditInRequiredOnly) {
            this.onCanEditInRequiredOnly();
            return;
        }

        this.serviceDialogs.dialogSelectedEmployeeGroup(this.viewContainerRef)
            .subscribe(resultGroup => {
                if (resultGroup) {
                    this.editValueForm.patchValue({
                        GroupCode: resultGroup.GroupCode,
                        GroupString: resultGroup.Description,
                    });
                }
            });
    }

    // on Employee Group Mis Click
    onEmployeeGroupMisClick(): void {
        if (this.CanEditInRequiredOnly) {
            this.onCanEditInRequiredOnly();
            return;
        }

        this.serviceDialogs.dialogSelectedEmployeeGroupMis(this.viewContainerRef)
            .subscribe(resultGroup => {
                if (resultGroup) {
                    this.editValueForm.patchValue({
                        GroupMIS: resultGroup.GroupMIS,
                        GroupMisString: resultGroup.GroupDesc,
                    });
                } else {
                    this.editValueForm.patchValue({
                        GroupMIS: "",
                        GroupMisString: "",
                    });
                }
            });
    }

    // on Employee Require click
    onEmployeeRequireClick(mode: string): void {
        if (this.CanEditInRequiredOnly) {
            this.onCanEditInRequiredOnly();
            return;
        }

        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef, "single")
            .subscribe(resultEmp => {
                if (resultEmp) {
                    let emp: Employee = Object.assign({}, resultEmp[0]);
                    this.editValueForm.patchValue({
                        EmpRequire: emp.EmpCode,
                        RequireString: `คุณ${emp.NameThai}`,
                    });
                }
            });
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        // console.log("getCellClass", value);
        // return {
        //    "is-cancel": value === "Cancel"
        // };

        if (value === "Use") {
            return { "is-wait": true };
        } else if (value === "Cancel") {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }

    // update value
    updateValue(event: any, cell: string, rowIndex: number): void {
        // console.log("inline editing rowIndex", rowIndex);
        // console.log(rowIndex + "-" + cell);
        // console.log("value:", event.target.value);

        if (this.editValue.OverTimeDetails) {
            // console.log("Get By index!", this.editValue.OverTimeDetails[rowIndex][cell]);
            // befor use index must add [key: string]: string | number | Date | undefined; in interface
            this.editValue.OverTimeDetails[rowIndex][cell] = event.target.value;
            this.editValue.OverTimeDetails = [...this.editValue.OverTimeDetails];
        }

        // console.log("UPDATED!", this.employees[rowIndex][cell]);
    }

    // on show work group-mis
    onShowWorkGroupMis(event?: any): void {
        // debug here
        // console.log("Event is:", event);

        if (event !== undefined) {
            this.showWorkGroupMis = event;
        }

        // console.log("ShowWorkGroupMis:", this.showWorkGroupMis);
    }

    // on valid data override
    onFormValid(isValid: boolean): void {
        // console.log("FormValue is :", this.editValueForm.value);

        this.editValue = this.editValueForm.value;
        if (isValid) {
            if (this.lastOverTimeMaster) {
                if (this.lastOverTimeMaster.OverTimeStatus) {
                    isValid = this.lastOverTimeMaster.OverTimeStatus === 3;
                }
            } 
        }

        if (isValid) {
            if (this.editValue.OverTimeDetails) {
                isValid = this.editValue.OverTimeDetails.length > 0;
            } else {
                isValid = false;
            }
        }

        this.communicateService.toParent([this.editValue, isValid]);
    }

    // on Lock edit
    onCanEditInRequiredOnly(): void {
        this.serviceDialogs.error("Error Message",
            "This Overtime-Require was approved. Only can input actual information.",
            this.viewContainerRef);
    }
}