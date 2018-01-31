import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { TaskMachine, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { TaskMachineService, TaskMachineServiceCommunicate } from "../../services/task-machine/task-machine.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "task-machine-progress",
    templateUrl: "./task-machine-progress.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        DataTableServiceCommunicate,
        TaskMachineServiceCommunicate
    ]
})
// task-machine-progress component*/
export class TaskMachineProgressComponent
    extends BaseMasterComponent<TaskMachine, TaskMachineService> {
    columns: Array<TableColumn> = [
        { prop: "MachineCode", name: "Code", flexGrow: 1 },
        { prop: "MachineName", name: "Name", flexGrow: 2 },
        { prop: "TypeMachineString", name: "Group", flexGrow: 1 },
    ];

    /** task-machine-progress ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<TaskMachine>,
        private serverAuth : AuthService,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
    ) {
        super(
            service,
            serviceCom,
            serviceComDataTable,
            dialogsService,
            viewContainerRef
        );
    }

    /** Called by Angular after task-machine-progress component initialized */
    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        // set where
        scroll.Where = "WaitAndProcess";

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
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: TaskMachine): void {
        return;
    }

    // on update data
    onUpdateToDataBase(value: TaskMachine): void {

        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.TaskMachineId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value: TaskMachine): void {
        return;
    }

    // on detail edit override
    onDetailEdit(value: TaskMachine): void {
        // debug here
        console.log("onDetailEdit on Process Component");
        if (value) {
            this.service.getOneKeyNumber(value.TaskMachineId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                    setTimeout(() => this.serviceCom.toChildEdit(this.displayValue), 1000);
                }, error => this.displayValue = undefined);
        }
    }

    // on SaveComplete override
    onSaveComplete(): void {
        this.dialogsService
            .context("System message", "Save completed.", this.viewContainerRef)
            .subscribe(result => {
                this.canSave = false;
                this.ShowEdit = false;
                this.displayValue = undefined;
                setTimeout(() => {
                    this.loadPagedData({
                        Skip: 0,
                        Take: 10,
                        Reload: true
                    })
                }, 150);
            });
    }
}