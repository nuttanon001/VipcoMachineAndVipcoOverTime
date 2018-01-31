import { Component, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute ,ParamMap} from "@angular/router";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { TaskMachine, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { TaskMachineService, TaskMachineServiceCommunicate } from "../../services/task-machine/task-machine.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "task-machine-master",
    templateUrl: "./task-machine-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        DataTableServiceCommunicate,
        TaskMachineServiceCommunicate
    ]
})
// task-machine-master component*/
export class TaskMachineMasterComponent
    extends BaseMasterComponent<TaskMachine, TaskMachineService> {
    onlyUser: boolean;
    // parameter
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    hasOverTime: boolean = false;
    columns: Array<TableColumn> = [
        { prop: "TaskMachineName", name: "Code", flexGrow :1 },
        { prop: "MachineString", name: "Machine", flexGrow: 2 },
        { prop: "CuttingPlanNo", name: "CuttingPlan", flexGrow: 2 },
        // { prop: "ActualStartDate", name: "ActualDate", pipe: this.datePipe , flexGrow: 1 },
    ];

    // task-machine-master ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<TaskMachine>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute,
        private serverAuth: AuthService,
        private serviceJobDetail: JobCardDetailService,
    ) {
        super(
            service,
            serviceCom,
            serviceComDataTable,
            dialogsService,
            viewContainerRef
        );
    }

    // on inti override
    ngOnInit(): void {
        this.onlyUser = true;
        // override class
        super.ngOnInit();

        this.route.paramMap.subscribe((param: ParamMap) => {
            let key: number = Number(param.get("condition") || 0);

            if (key) {
                let newTaskMachine: TaskMachine = {
                    TaskMachineId: 0,
                    JobCardDetailId: key
                };
                setTimeout(() => {
                    this.onDetailEdit(newTaskMachine);
                }, 500);
            }
        }, error => console.error(error));
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        if (this.onlyUser) {
            if (this.serverAuth.getAuth) {
                scroll.Where = this.serverAuth.getAuth.UserName || "";
            }
        } else {
            scroll.Where = "";
        }

        if (this.scroll) {
            if (this.scroll.Filter && scroll.Reload) {
                scroll.Filter = this.scroll.Filter;
            }
        }

        // debug here
        // console.log("Scroll is", JSON.stringify(scroll));

        this.scroll = scroll;
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: TaskMachine): TaskMachine {
        let zone:string = "Asia/Bangkok";
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

            if (value.TaskMachineHasOverTimes) {
                value.TaskMachineHasOverTimes.forEach((OverTime, index) => {
                    if (OverTime.CreateDate) {
                        OverTime.CreateDate = moment.tz(OverTime.CreateDate, zone).toDate();
                    }
                    if (OverTime.ModifyDate) {
                        OverTime.ModifyDate = moment.tz(OverTime.ModifyDate, zone).toDate();
                    }
                    if (OverTime.OverTimeDate) {
                        OverTime.OverTimeDate = moment.tz(OverTime.OverTimeDate, zone).toDate();
                    }

                    if (value.TaskMachineHasOverTimes) {
                        value.TaskMachineHasOverTimes[index] = OverTime;
                    }
                });
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: TaskMachine): void {
        // check value task machine
        value = this.onCheckValueTaskMachine(value);

        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        } else {
            this.dialogsService.error("Error Message", "บัญชีผู้ใช้งาน ขาดการติดต่อกับระบบ โปรดล็อคอินใหม่ !!!", this.viewContainerRef);
            return;
        }
        // change timezone
        value = this.changeTimezone(value);

        // change standard-time
        if (value.StandardTimeId && value.JobCardDetailId) {
            this.serviceJobDetail.getChangeStandardTime(value.JobCardDetailId, value.StandardTimeId, value.Creator || "Someone")
                .subscribe(undefined, undefined);
        }

        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.editValue.Creator = undefined;
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: TaskMachine): void {
        // check value task machine
        value = this.onCheckValueTaskMachine(value);

        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);

        // change standard-time
        if (value.StandardTimeId && value.JobCardDetailId) {
            this.serviceJobDetail.getChangeStandardTime(value.JobCardDetailId, value.StandardTimeId, value.Creator || "Someone")
                .subscribe(undefined, undefined);
        }

        // update data
        this.service.putKeyNumber(value, value.TaskMachineId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },(error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value: TaskMachine): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.TaskMachineId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                    this.service.getTaskMachineHasOverTime(dbData.TaskMachineId)
                        .subscribe(Result => {
                            this.hasOverTime = Result.Result;
                        });
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }

    // on check TaskMachine
    onCheckValueTaskMachine(value: TaskMachine): TaskMachine {
        if (value.CurrentQuantity) {
            if (!value.ActualStartDate) {
                value.ActualStartDate = new Date;
            }

            if (value.TotalQuantity === value.CurrentQuantity) {
                if (!value.ActualEndDate) {
                    value.ActualEndDate = new Date;
                }
            }
        }
        // if actual end set production full qty
        if (value.ActualEndDate) {
            value.CurrentQuantity = value.TotalQuantity;

            if (!value.ActualStartDate) {
                value.ActualStartDate = value.ActualEndDate;
            }
        }

        return value;
    }

    // on get paper taskmachine
    onGetPaper(value?: TaskMachine):void {
        if (value) {
            this.service.getTaskMachinePaper(value.TaskMachineId)
                .subscribe(data => {
                    let link:any = document.createElement("a");
                    link.href = window.URL.createObjectURL(data);
                    link.download = "report_" + value.TaskMachineName + ".xlsx";
                    link.click();
                    // get paper for over time
                    // this.onGetPaperTaskMachineOverTime(value);
                },
                error => this.dialogsService.error("Error Message", "ไม่พบข้อมููลที่ต้องการ", this.viewContainerRef),
                () => console.log("Completed file download."));
        }
    }

    // on get paper TaskMachine OverTime
    onGetPaperTaskMachineOverTime(value?: TaskMachine): void {
        if (value) {
            this.service.GetTaskMachinePaperOverTime(value.TaskMachineId)
                .subscribe(data => {
                    let link:any = document.createElement("a");
                    link.href = window.URL.createObjectURL(data);
                    link.download = "overtime_" + value.TaskMachineName + ".xlsx";
                    link.click();
                }, error => console.error(error));
        }
    }
}