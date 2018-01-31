// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators, AbstractControl, FormGroup } from "@angular/forms";
// models
import {
    TaskMachine, TaskMachineHasOverTime,
    Employee, JobCardDetail, AttachFile,
    PlanViewModel
} from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { StandardTimeService } from "../../services/standard-time/standard-time.service";
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
import { JobCardMasterService } from "../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
import { TaskMachineService, TaskMachineServiceCommunicate } from "../../services/task-machine/task-machine.service";
import { AuthService } from "../../services/auth/auth.service";
// primeng
import { SelectItem } from "primeng/primeng";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "task-machine-edit",
    templateUrl: "./task-machine-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// task-machine-edit component*/
export class TaskMachineEditComponent
    extends BaseEditComponent<TaskMachine, TaskMachineService> {
    // paramater
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    jobCardDetail: JobCardDetail = {
        JobCardDetailId: 0,
        FullNameString: "",
        CuttingPlanString: "",
        StandardTimeString: "",
        Material: "",
        Quality: 0,
        UnitsMeasureString: "",
    };
    oldDate: string;
    overTime: TaskMachineHasOverTime | undefined;
    indexOverTime: number;
    attachFiles: Array<AttachFile> = new Array;
    messageMachine: string;
    // task-machine-edit ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        private serviceOverTime: TaskMachineHasOverTimeService,
        private serviceJobCardMaster: JobCardMasterService,
        private serviceJobCardDetail: JobCardDetailService,
        private serviceStandard: StandardTimeService,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private serviceAuth: AuthService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: TaskMachine): void {
        if (value) {
            if (value.TaskMachineId) {
                this.service.getOneKeyNumber(value.TaskMachineId)
                    .subscribe(dbData => {
                        this.editValue = dbData;
                        // set Date
                        // planStartDate
                        if (this.editValue.PlannedStartDate) {
                            this.editValue.PlannedStartDate = this.editValue.PlannedStartDate != null ?
                                new Date(this.editValue.PlannedStartDate) : new Date();
                        }
                        // planEndDate
                        if (this.editValue.PlannedEndDate) {
                            this.editValue.PlannedEndDate = this.editValue.PlannedEndDate != null ?
                                new Date(this.editValue.PlannedEndDate) : new Date();
                        }
                        // actualStartDate
                        if (this.editValue.ActualStartDate) {
                            this.editValue.ActualStartDate = this.editValue.ActualStartDate != null ?
                                new Date(this.editValue.ActualStartDate) : new Date();
                        }
                        // actualEndDate
                        if (this.editValue.ActualEndDate) {
                            this.editValue.ActualEndDate = this.editValue.ActualEndDate != null ?
                                new Date(this.editValue.ActualEndDate) : new Date();
                        }
                        // overTime
                        if (this.editValue.TaskMachineId) {
                            this.serviceOverTime.getByMasterId(this.editValue.TaskMachineId)
                                .subscribe(dbOperator => {
                                    dbOperator.forEach(item => {
                                        item.OverTimeDate = new Date(item.OverTimeDate || new Date);
                                    });

                                    this.editValue.TaskMachineHasOverTimes = dbOperator.slice();
                                    this.editValueForm.patchValue({
                                        TaskMachineHasOverTimes: this.editValue.TaskMachineHasOverTimes.slice(),
                                    });
                                });
                        }
                        // jobCardDetail
                        if (this.editValue.JobCardDetailId) {
                            this.serviceJobCardDetail.getOneKeyNumber(this.editValue.JobCardDetailId)
                                .subscribe(dbJobCardDetail => {
                                    this.jobCardDetail = dbJobCardDetail;
                                    if (this.jobCardDetail.StandardTimeString === "-") {
                                        this.jobCardDetail.StandardTimeString = "Click to selected StandardTime here.";
                                    }
                                    // get attach file
                                    this.getAttach();
                                });
                        }

                    }, error => console.error(error), () => this.defineData());
            } else {
                // debug here
                // console.log("From Waiting JobCardDetail");
                // have job card detail
                if (value.JobCardDetailId) {
                    this.editValue = {
                        TaskMachineId: 0,
                        TaskMachineStatus: 1,
                        JobCardDetailId: value.JobCardDetailId,
                        PlannedStartDate: new Date(),
                    };

                    if (this.serviceAuth.getAuth) {
                        this.editValue.AssignedBy = this.serviceAuth.getAuth.EmpCode;
                        this.editValue.AssignedByString = this.serviceAuth.getAuth.NameThai;
                    }

                    this.defineData();
                    // get jobcard-detail
                    if (this.editValue.JobCardDetailId) {
                        this.serviceJobCardDetail.getOneKeyNumber(this.editValue.JobCardDetailId)
                            .subscribe(dbJobCardDetail => {
                                this.jobCardDetail = dbJobCardDetail;
                                if (this.jobCardDetail.StandardTimeString === "-") {
                                    this.jobCardDetail.StandardTimeString = "Click to selected StandardTime here.";
                                }

                                if (this.editValueForm) {
                                    this.editValueForm.patchValue({
                                        TotalQuantity: dbJobCardDetail.Quality,
                                    });
                                }
                                // get attach file
                                this.getAttach();
                            }, error => console.error(error), () => {
                                this.onUpdatePlanStartAndEndDate();
                            });
                    }
                }

                if (this.serviceAuth.getAuth) {
                    this.editValue.AssignedByString = this.serviceAuth.getAuth.NameThai || "";
                    this.editValue.AssignedBy = this.serviceAuth.getAuth.EmpCode || "";
                }
            }
        } else {
            this.editValue = {
                TaskMachineId: 0,
                TaskMachineStatus: 1,
                PlannedStartDate: new Date()
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
        this.overTime = undefined;
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            TaskMachineId: [this.editValue.TaskMachineId],
            TaskMachineName: [this.editValue.TaskMachineName,
                [
                    Validators.maxLength(200),
                ]
            ],
            Description: [this.editValue.Description,
                [
                    Validators.maxLength(50),
                ]
            ],
            Priority: [this.editValue.Priority],
            TotalQuantity: [this.editValue.TotalQuantity],
            CurrentQuantity: [this.editValue.CurrentQuantity],
            PlannedStartDate: [this.editValue.PlannedStartDate,
                [
                    Validators.required
                ]
            ],
            PlannedEndDate: [this.editValue.PlannedEndDate,
                [
                    Validators.required
                ]
            ],
            ActualStartDate: [this.editValue.ActualStartDate],
            ActualEndDate: [this.editValue.ActualEndDate],
            ActualManHours: [this.editValue.ActualManHours],
            TaskMachineStatus: [this.editValue.TaskMachineStatus],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            // fk
            MachineId: [this.editValue.MachineId,
                [
                    Validators.required
                ]
            ],
            JobCardDetailId: [this.editValue.JobCardDetailId],
            AssignedBy: [this.editValue.AssignedBy],
            PrecedingTaskMachineId: [this.editValue.PrecedingTaskMachineId],
            TaskMachineHasOverTimes: [this.editValue.TaskMachineHasOverTimes],
            MachineString: [this.editValue.MachineString],
            CuttingPlanNo: [this.editValue.CuttingPlanNo],
            AssignedByString: [this.editValue.AssignedByString],
            StandardTimeId: [this.editValue.StandardTimeId]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

        const control: AbstractControl | null = this.editValueForm.get("PlannedStartDate");
        if (control) {
            control.valueChanges.subscribe((data: any) => this.onUpdatePlanStartAndEndDate());
        }
    }

    // on Value Change Override
    onValueChanged(data?: any): void {
        if (!this.editValueForm) {
            return;
        }

        const form: FormGroup = this.editValueForm;
        const controlT: AbstractControl | null = form.get("TotalQuantity");
        const controlC: AbstractControl | null = form.get("CurrentQuantity");

        const controlAS: AbstractControl | null = form.get("ActualStartDate");
        const controlAE: AbstractControl | null = form.get("ActualEndDate");

        const controlPS: AbstractControl | null = form.get("PlannedStartDate");
        const controlPE: AbstractControl | null = form.get("PlannedEndDate");
        const controlMC: AbstractControl | null = form.get("MachineId");


        if (controlC && controlT) {
            if (controlC.value && controlT.value) {
                if (controlC.value > controlT.value) {
                    this.editValueForm.patchValue({
                        CurrentQuantity: controlT.value
                    });
                }
            }
        }

        if (controlAS && controlAE) {
            if (controlAS.value && controlAE.value) {
                if (controlAS.value > controlAE.value) {
                    this.editValueForm.patchValue({
                        ActualStartDate: controlAE.value
                    });
                } else if (controlAE.value < controlAS.value) {
                    this.editValueForm.patchValue({
                        ActualEndDate: controlAS.value
                    });
                }
            }
        }

        if (controlPS && controlPE && controlMC) {
            if (controlPS.value && controlPE.value && controlMC.value) {
                // console.log("Check Task Machine");
                this.service.postTaskMachineTime(form.value)
                    .subscribe(checkData => {
                        // console.log("checkData", checkData);

                        if (checkData.AnyData) {
                            this.messageMachine = "This machine already has planed in same date.<br/>But it 's up to you.";
                        } else {
                            this.messageMachine = "";
                        }
                    });
            }
        }

        super.onValueChanged();
    }

    // new OverTime
    onNewOrEditOverTime(overTime?: TaskMachineHasOverTime): void {
        const controlMin: AbstractControl | null = this.editValueForm.get("ActualStartDate");
        let break1: boolean = (!controlMin) || (!controlMin.value);
        if (break1) {
            this.serviceDialogs.error("Actual Date not found.",
                "Please set actual date befor add overtime to TaskMachine.",
                this.viewContainerRef);
            return;
        }

        const control: AbstractControl | null = this.editValueForm.get("MachineId");
        if (control) {
            if (control.value) {
                if (overTime) {
                    if (this.editValue.TaskMachineHasOverTimes) {
                        this.indexOverTime = this.editValue.TaskMachineHasOverTimes.indexOf(overTime);
                    } else {
                        this.indexOverTime = -1;
                    }
                    this.overTime = Object.assign({}, overTime);
                } else {
                    this.overTime = {
                        OverTimeId: 0,
                        OverTimeDate: controlMin === null ? new Date : controlMin.value,
                        TaskMachineId: this.editValue.TaskMachineId
                    };
                    this.indexOverTime = -1;
                }
                return;
            }
        }
        this.serviceDialogs.error("Not Found MachineNo.", "Plase selected machine befor set OverTime.", this.viewContainerRef);
    }

    // edit OverTime
    onComplateOrCancel(overTime?: TaskMachineHasOverTime): void {
        if (!this.editValue.TaskMachineHasOverTimes) {
            this.editValue.TaskMachineHasOverTimes = new Array;
        } else {
            // debug here
            // console.log("Check overtime");
            if (this.editValue.TaskMachineHasOverTimes.find(
                (item) => {
                    if (item && overTime) {
                        if (item.EmpCode === overTime.EmpCode) {
                            if (item.OverTimeDate && overTime.OverTimeDate) {
                                // console.log("Data", item.OverTimeDate.toLocaleDateString(), overTime.OverTimeDate.toLocaleDateString());
                                return item.OverTimeDate.toLocaleDateString() === overTime.OverTimeDate.toLocaleDateString();
                            }
                        }
                    }
                    return false;
                })) {

                this.serviceDialogs.error("Error Message",
                    "OverTime for this employee already has in system.",
                    this.viewContainerRef);
                return;
           }
        }

        if (overTime && this.editValue.TaskMachineHasOverTimes) {
            if (this.indexOverTime > -1) {
                // remove item
                this.editValue.TaskMachineHasOverTimes.splice(this.indexOverTime, 1);
            }
            // cloning an object
            this.editValue.TaskMachineHasOverTimes.push(Object.assign({}, overTime));
            this.editValueForm.patchValue({
                TaskMachineHasOverTimes: this.editValue.TaskMachineHasOverTimes.slice(),
            });
        }
        this.overTime = undefined;
    }

    // remove OverTime
    onRemoveOverTime(overTime: TaskMachineHasOverTime): void {
        if (overTime && this.editValue.TaskMachineHasOverTimes) {
            // find id
            let index: number = this.editValue.TaskMachineHasOverTimes.indexOf(overTime);

            if (index > -1) {
                this.editValue.TaskMachineHasOverTimes.splice(index, 1);
                // update array
                this.editValue.TaskMachineHasOverTimes = [...this.editValue.TaskMachineHasOverTimes];
                // cloning an object
                this.editValueForm.patchValue({
                    TaskMachineHasOverTimes: this.editValue.TaskMachineHasOverTimes.slice(),
                });
            }
        }
    }

    // jobCardDetail
    onSelectJobCardDetail(): void {
        this.serviceDialogs.dialogSelectedJobCardDetail(this.viewContainerRef,1)
            .subscribe(jobCardDetail => {
                if (jobCardDetail) {
                    this.serviceJobCardDetail.getOneKeyNumber(jobCardDetail.JobCardDetailId)
                        .subscribe(dbJobCardDetail => {
                            this.jobCardDetail = dbJobCardDetail;
                            if (this.jobCardDetail.StandardTimeString === "-") {
                                this.jobCardDetail.StandardTimeString = "Click to selected StandardTime here.";
                            }

                            this.editValueForm.patchValue({
                                JobCardDetailId: this.jobCardDetail.JobCardDetailId,
                                TotalQuantity: this.jobCardDetail.Quality,
                            });
                            this.getAttach();
                            this.onUpdatePlanStartAndEndDate();
                        });
                }
            });
    }

    // on StandardTime click
    onStandardTimeClick(): void {
        let mode: number = 0;
        if (this.jobCardDetail) {
            if (this.jobCardDetail.JobCardMaster) {
                mode = this.jobCardDetail.JobCardMaster.TypeMachineId || 0;
            }
        }

        if (mode < 1) {
            this.serviceDialogs.error("Warning Message",
                "Select \"Machine Required Detail\" befor select MachineNo.",
                this.viewContainerRef);
            return;
        }

        // console.log(this.MachineTypeId);
        this.serviceDialogs.dialogSelectStandardTime(this.viewContainerRef, mode)
            .subscribe(resultStdTime => {
                if (resultStdTime) {
                    // to JobCardDetail
                    this.jobCardDetail.StandardTimeId = resultStdTime.StandardTimeId;
                    this.jobCardDetail.StandardTimeString = `${resultStdTime.GradeMaterialString} - ${resultStdTime.StandardTimeCode}`;
                    // patch value to FormGroup
                    this.editValueForm.patchValue({
                        StandardTimeId: resultStdTime.StandardTimeId,
                    });

                    this.onUpdatePlanStartAndEndDate(true);
                }
            });
    }

    // assignedBy
    onSelectedAssignedBy(): void {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef,"Once")
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

    // machine
    onSelectedMachine(): void {
        let mode: number = 0;
        if (this.jobCardDetail) {
            if (this.jobCardDetail.JobCardMaster) {
                mode = this.jobCardDetail.JobCardMaster.TypeMachineId || 0;
            }
        }

        // debug here
        // console.log("Mode", mode);

        if (mode < 1) {
            this.serviceDialogs.error("Warning Message",
                "Select \"Machine Required Detail\" befor select MachineNo.",
                this.viewContainerRef);
            return;
        }

        this.serviceDialogs.dialogSelectMachine(this.viewContainerRef, mode)
            .subscribe(machine => {
                if (machine) {
                    this.editValueForm.patchValue({
                        MachineId: machine.MachineId,
                        MachineString: `${machine.MachineCode}/${machine.MachineName}`
                    });
                }
            });
    }

    // update PlanDate
    onUpdatePlanStartAndEndDate(standard:boolean = false): void {
        if (!this.editValueForm || !this.jobCardDetail) { return; }

        const form:FormGroup = this.editValueForm;
        const control: AbstractControl|null = form.get("PlannedStartDate");
        let planViewModel: PlanViewModel = {};
        // if have planned start date
        if (control) {
            if (control.value) {
                planViewModel.PlannedStartDate = control.value;
            }

            if (!this.jobCardDetail.StandardTimeId) {
                return;
            } else if (this.jobCardDetail.StandardTimeId < 1) {
                return;
            }

            // beark loop
            if (!standard) {
                if (this.oldDate) {
                    if (planViewModel.PlannedStartDate) {
                        let compare: string = planViewModel.PlannedStartDate.toLocaleDateString();
                        // console.log("Compare: " + compare + " : " + this.oldDate);
                        if (this.oldDate === compare) {
                            return;
                        }
                    }
                }
            }


            planViewModel.Quantity = this.jobCardDetail.Quality;
            planViewModel.StandardTimeId = this.jobCardDetail.StandardTimeId;

            this.serviceStandard.postStanadardTimePlan(planViewModel)
                .subscribe(updatePlan => {
                    if (updatePlan) {
                        if (updatePlan.PlannedStartDate && updatePlan.PlannedEndDate) {
                            this.oldDate = new Date(updatePlan.PlannedStartDate).toLocaleDateString();
                            this.editValueForm.patchValue({
                                PlannedStartDate: new Date(updatePlan.PlannedStartDate),
                                PlannedEndDate: new Date(updatePlan.PlannedEndDate),
                            });
                        }
                    }
                });
        }
    }

    // get Attach
    getAttach(): void {
        if (this.jobCardDetail) {
            if (this.jobCardDetail.JobCardMasterId) {
                this.serviceJobCardMaster.getAttachFile(this.jobCardDetail.JobCardMasterId)
                    .subscribe(dbAttach => {
                        this.attachFiles = dbAttach.slice();
                    }, error => console.error(error));
            }
        }
    }

    // open attact file
    onOpenNewLink(link: string): void {
        if (link) {
            window.open(link, "_blank");
        }
    }
}