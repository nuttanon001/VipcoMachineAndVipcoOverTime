// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators, AbstractControl, FormGroup } from "@angular/forms";
// models
import {
    NoTaskMachine, Employee, EmployeeGroup,JobCardDetail
} from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import {
    TaskMachineService,
    TaskMachineServiceCommunicate
} from "../../services/task-machine/task-machine.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
import { AuthService } from "../../services/auth/auth.service";
// primeng
import { SelectItem } from "primeng/primeng";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "notask-machine-edit",
    templateUrl: "./notask-machine-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// notask-machine component*/
export class NoTaskMachineEditComponent 
    extends BaseEditComponent<NoTaskMachine, TaskMachineService> {
    jobCardDetail: JobCardDetail;

    /** notask-machine ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private serviceJobDetail: JobCardDetailService,
        private serviceAuth: AuthService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: NoTaskMachine): void {
        if (value) {
            if (value.NoTaskMachineId) {
                this.service.getNoTaskMachineOneKeyNumber(value.NoTaskMachineId)
                    .subscribe(dbData => {
                        this.editValue = dbData;
                        // set Date
                        if (this.editValue.Date) {
                            this.editValue.Date = this.editValue.Date != null ?
                                new Date(this.editValue.Date) : new Date();
                        }

                        if (this.editValue.JobCardDetailId) {
                            this.serviceJobDetail.getOneKeyNumber(this.editValue.JobCardDetailId)
                                .subscribe(dbJobCardDetail => {
                                    this.jobCardDetail = dbJobCardDetail;
                                    this.jobCardDetail.StandardTimeString = "-";

                                    if (this.editValueForm) {
                                        this.editValueForm.patchValue({
                                            Quantity: dbJobCardDetail.Quality,
                                        });
                                    }
                                }, error => console.error(error));
                        }

                    }, error => console.error(error), () => this.defineData());
            } else {
                if (value.JobCardDetailId) {
                    this.editValue = {
                        NoTaskMachineId: 0,
                        JobCardDetailId: value.JobCardDetailId,
                        Date: new Date(),
                    };

                    if (this.serviceAuth.getAuth) {
                        this.editValue.AssignedBy = this.serviceAuth.getAuth.EmpCode;
                        this.editValue.AssignedByString = this.serviceAuth.getAuth.NameThai;
                    }
                    this.defineData();

                    if (this.editValue.JobCardDetailId) {
                        this.serviceJobDetail.getOneKeyNumber(this.editValue.JobCardDetailId)
                            .subscribe(dbJobCardDetail => {
                                this.jobCardDetail = dbJobCardDetail;
                                this.jobCardDetail.StandardTimeString = "-";

                                if (this.editValueForm) {
                                    this.editValueForm.patchValue({
                                        Quantity: dbJobCardDetail.Quality,
                                    });
                                }
                            }, error => console.error(error));
                    }
                }

                if (this.serviceAuth.getAuth) {
                    this.editValue.AssignedByString = this.serviceAuth.getAuth.NameThai || "";
                    this.editValue.AssignedBy = this.serviceAuth.getAuth.EmpCode || "";
                }
            }
        } else {
            this.editValue = {
                NoTaskMachineId: 0,
                Date: new Date()
            };

            if (this.serviceAuth.getAuth) {
                this.editValue.AssignedByString = this.serviceAuth.getAuth.NameThai || "";
                this.editValue.AssignedBy = this.serviceAuth.getAuth.EmpCode || "";
            }
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
            NoTaskMachineId: [this.editValue.NoTaskMachineId],
            NoTaskMachineCode: [this.editValue.NoTaskMachineCode,
                [
                    Validators.maxLength(50),
                ]
            ],
            Description: [this.editValue.Description,
                [
                    Validators.maxLength(200),
                ]
            ],
            Remark: [this.editValue.Description,
                [
                    Validators.maxLength(200),
                ]
            ],
            Quantity: [this.editValue.Quantity],
            Date: [this.editValue.Date],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            // fk
            JobCardDetailId: [this.editValue.JobCardDetailId,
                [
                    Validators.required
                ]
            ],
            AssignedBy: [this.editValue.AssignedBy],
            GroupCode: [this.editValue.GroupCode],
            GroupMis:[this.editValue.GroupMis],
            AssignedByString: [this.editValue.AssignedByString],
            GroupCodeString: [this.editValue.GroupCodeString],
            GroupMisString: [this.editValue.GroupMisString]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // job card detail
    onSelectJobCardDetail(): void {
        return;
    }

    // assignedBy
    onSelectedAssignedBy(): void {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef, "Once")
            .subscribe(employees => {
                if (employees) {
                    let employee: Employee = Object.assign({}, employees[0]);
                    // cloning an object
                    this.editValueForm.patchValue({
                        AssignedByString: employee.NameThai,
                        AssignedBy: employee.EmpCode,
                    });
                }
            });
    }

    // groupcode
    onSelectedGroupCodeBy(): void {
        this.serviceDialogs.dialogSelectedEmployeeGroup(this.viewContainerRef)
            .subscribe(group => {
                if (group) {
                    // cloning an object
                    this.editValueForm.patchValue({
                        GroupCode: group.GroupCode,
                        GroupCodeString: group.Description,
                    });
                }
            });
    }

    // groupmis
    onSelectedGroupMisBy(): void {
        this.serviceDialogs.dialogSelectedEmployeeGroupMis(this.viewContainerRef)
            .subscribe(groupMis => {
                if (groupMis) {
                    // cloning an object
                    this.editValueForm.patchValue({
                        GroupMis: groupMis.GroupMIS,
                        GroupMisString: groupMis.GroupDesc,
                    });
                }
            })
    }
}