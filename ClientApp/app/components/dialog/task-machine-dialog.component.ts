import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormBuilder,FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
// models
import { TaskMachine } from "../../models/model.index";
// service
import { TaskMachineService } from "../../services/task-machine/task-machine.service";
import { AuthService } from "../../services/auth/auth.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// timezone
import * as moment from "moment-timezone";

@Component({
    selector: "task-machine-dialog",
    templateUrl: "./task-machine-dialog.component.html",
    styleUrls: [
        "../../styles/master.style.scss",
        "../../styles/edit.style.scss"
    ],
    providers: [
        TaskMachineService,
    ]

})
// task-machine-dialog component*/
export class TaskMachineDialogComponent implements OnInit {

    taskMachine: TaskMachine;
    taskMachineForm: FormGroup;
    formMessage: string;
    toDay: Date = new Date;
    waiting: boolean = false;
    // task-machine-dialog ctor */
    constructor(
        private service: TaskMachineService,
        private serviceAuth: AuthService,
        public dialogRef: MatDialogRef<TaskMachineDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public TaskMachineId: number,
        private fb: FormBuilder
    ) { }

    // called by Angular after task-machine-dialog component initialized */
    ngOnInit(): void {
        // debug here
        // console.log("TaskMachineID :", this.TaskMachineId);

        if (this.TaskMachineId) {
            this.service.getOneKeyNumber(this.TaskMachineId)
                .subscribe(dbTaskMachine => {
                    this.taskMachine = dbTaskMachine;
                    // planStartDate
                    if (this.taskMachine.PlannedStartDate) {
                        this.taskMachine.PlannedStartDate = this.taskMachine.PlannedStartDate != null ?
                            new Date(this.taskMachine.PlannedStartDate) : new Date();
                    }
                    // planEndDate
                    if (this.taskMachine.PlannedEndDate) {
                        this.taskMachine.PlannedEndDate = this.taskMachine.PlannedEndDate != null ?
                            new Date(this.taskMachine.PlannedEndDate) : new Date();
                    }

                    // actualStartDate
                    if (this.taskMachine.ActualStartDate) {
                        this.taskMachine.ActualStartDate = this.taskMachine.ActualStartDate != null ?
                            new Date(this.taskMachine.ActualStartDate) : new Date();
                    }
                    // actualEndDate
                    if (this.taskMachine.ActualEndDate) {
                        this.taskMachine.ActualEndDate = this.taskMachine.ActualEndDate != null ?
                            new Date(this.taskMachine.ActualEndDate) : new Date();
                    }

                    // debug here
                    // console.log("Task Machine Data:", this.taskMachine);

                    this.buildForm();
                }, error => {
                    this.formMessage = "Not found task machine. system will send you back soon.";
                    setTimeout(() => {
                        this.formMessage = "";
                        this.dialogRef.close();
                    }, 1000);
                });
        }
    }

    // build form
    buildForm(): void {
        // console.log("Befor :", this.taskMachine);

        this.taskMachineForm = this.fb.group({
            TaskMachineId: [this.taskMachine.TaskMachineId],
            TaskMachineName: [this.taskMachine.TaskMachineName],
            Description: [this.taskMachine.Description,],
            Priority: [this.taskMachine.Priority],
            TotalQuantity: [this.taskMachine.TotalQuantity],
            CurrentQuantity: [this.taskMachine.CurrentQuantity],
            PlannedStartDate:[this.taskMachine.PlannedStartDate],
            PlannedEndDate: [this.taskMachine.PlannedEndDate],
            ActualStartDate: [this.taskMachine.ActualStartDate],
            ActualEndDate: [this.taskMachine.ActualEndDate],
            ActualManHours: [this.taskMachine.ActualManHours],
            TaskMachineStatus: [this.taskMachine.TaskMachineStatus],
            Creator: [this.taskMachine.Creator],
            CreateDate: [this.taskMachine.CreateDate],
            Modifyer: [this.taskMachine.Modifyer],
            ModifyDate: [this.taskMachine.ModifyDate],
            // fk
            MachineId: [this.taskMachine.MachineId,],
            JobCardDetailId: [this.taskMachine.JobCardDetailId],
            AssignedBy: [this.taskMachine.AssignedBy],
            PrecedingTaskMachineId: [this.taskMachine.PrecedingTaskMachineId],
            TaskMachineHasOverTimes: [this.taskMachine.TaskMachineHasOverTimes],
            MachineString: [this.taskMachine.MachineString],
            CuttingPlanNo: [this.taskMachine.CuttingPlanNo],
            AssignedByString: [this.taskMachine.AssignedByString]
        });

        // console.log("Form :", this.taskMachineForm.value);

        this.taskMachineForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // on Form Value Change
    onValueChanged(data?: any): void {
        if (!this.taskMachineForm) { return; }
        const form:FormGroup = this.taskMachineForm;
        const controlT: AbstractControl | null = form.get("TotalQuantity");
        const controlC: AbstractControl | null = form.get("CurrentQuantity");

        const controlAS: AbstractControl | null = form.get("ActualStartDate");
        const controlAE: AbstractControl | null = form.get("ActualEndDate");

        if (controlC && controlT) {
            if (controlC.value && controlT.value) {
                if (controlC.value > controlT.value) {
                    this.taskMachineForm.patchValue({
                        CurrentQuantity: controlT.value
                    });
                }
            }
        }

        if (controlAS && controlAE) {
            if (controlAS.value && controlAE.value) {
                if (controlAS.value > controlAE.value) {
                    this.taskMachineForm.patchValue({
                        ActualStartDate: controlAE.value
                    });
                } else if (controlAE.value < controlAS.value) {
                    this.taskMachineForm.patchValue({
                        ActualEndDate: controlAS.value
                    });
                }
            }
        }
    }

    // on Update TaskMachine to DataBase
    onUpdateTaskMachine(): void {
        if (!this.taskMachineForm) {
            return;
        }

        if (this.taskMachineForm.valid) {
            this.taskMachine = this.taskMachineForm.value;
            // console.log("TaskMachine :", this.taskMachine);

            if (this.taskMachine.CurrentQuantity) {
                if (!this.taskMachine.ActualStartDate) {
                    this.taskMachine.ActualStartDate = new Date;
                }

                if (this.taskMachine.TotalQuantity === this.taskMachine.CurrentQuantity) {
                    if (!this.taskMachine.ActualEndDate) {
                        this.taskMachine.ActualEndDate = new Date;
                    }
                }
            }
            // if actual end set production full qty
            if (this.taskMachine.ActualEndDate) {
                this.taskMachine.CurrentQuantity = this.taskMachine.TotalQuantity;

                if (!this.taskMachine.ActualStartDate) {
                    this.taskMachine.ActualStartDate = this.taskMachine.ActualEndDate;
                }
            }

            if (this.serviceAuth.getAuth) {
                this.taskMachine.Modifyer = this.serviceAuth.getAuth.UserName || "";
            }

            this.taskMachine = this.changeTimezone(this.taskMachine);

            // console.log("TaskMachine After :", this.taskMachine);


            this.service.putKeyNumber(this.taskMachine, this.taskMachine.TaskMachineId)
                .subscribe(dbTaskMachine => this.onComplateClick(dbTaskMachine),
                error => {
                    this.formMessage = "Can't update task machine. please try again.";
                    setTimeout(() => {
                        this.formMessage = "";
                    }, 1500);
                });
        }
    }

    // set ToDay
    onSetDateToDay(mode: string):void {
        if (mode) {
            if (mode === "start") {
                this.taskMachineForm.patchValue({
                    ActualStartDate: new Date()
                });
            } else {
                this.taskMachineForm.patchValue({
                    ActualEndDate: new Date()
                });
            }
        }
    }

    // on change time zone befor update to webapi
    changeTimezone(value: TaskMachine): TaskMachine {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.PlannedStartDate !== null) {
                value.PlannedStartDate = moment.tz(value.PlannedStartDate, zone).toDate();
            }
            if (value.PlannedEndDate !== null) {
                value.PlannedEndDate = moment.tz(value.PlannedEndDate, zone).toDate();
            }
            if (value.ActualStartDate !== null) {
                value.ActualStartDate = moment.tz(value.ActualStartDate, zone).toDate();
            }
            if (value.ActualEndDate !== null) {
                value.ActualEndDate = moment.tz(value.ActualEndDate, zone).toDate();
            }
        }
        return value;
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // update Click
    onComplateClick(taskMachine: TaskMachine): void {
        this.dialogRef.close(taskMachine);
    }
}
