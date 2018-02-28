import { Component, OnInit, Inject, } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// Service
import { TaskMachineService } from "../../../services/task-machine/task-machine.service";
// 3rd Party
import { LazyLoadEvent } from "primeng/primeng";
// Model
import { OptionSchedule } from '../../../models/model.index';

@Component({
    selector: "machine-schedule-dialog",
    templateUrl: "./machine-schedule-dialog.component.html",
    styleUrls: [
        "../../../styles/master.style.scss",
        "../../../styles/schedule.style.scss"],
    providers: [
        TaskMachineService,
    ]
})
/** machine-schedule-dialog component*/
export class MachineScheduleDialogComponent implements OnInit {
    /** machine-schedule-dialog ctor */
    constructor(
        private service: TaskMachineService,
        public dialogRef: MatDialogRef<MachineScheduleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public publicData: OptionSchedule
    ) { }

    //@param
    columnsUpper: Array<any>;
    columnsLower: Array<any>;
    columns: Array<any>;
    taskMachines: Array<any>;
    totalRecords: number;

    ngOnInit(): void {
        this.taskMachines = new Array;

        if (!this.publicData) {
            this.dialogRef.afterClosed();
        } else {
            this.onGetTaskMasterSchedule(this.publicData);
        }
    }

    // get task master schedule data
    onGetTaskMasterSchedule(optionSchedule: OptionSchedule): void {
        this.service.getTaskMachineWaitAndProcess(this.publicData, "MachineSchedule/")
            .subscribe(dbDataSchedule => {
                this.totalRecords = dbDataSchedule.TotalRow;

                this.columns = new Array;
                this.columnsUpper = new Array;

                let McNoWidth: string = "100px";
                let JbNoWidth: string = "170px";
                let CtNoWidth: string = "350px";
                let NumWidth: string = "55px";

                // column Row1
                this.columnsUpper.push({ header: "MachineNo", rowspan: 2, style: { "width": McNoWidth, } });
                this.columnsUpper.push({ header: "JobNo", rowspan: 2, style: { "width": JbNoWidth, } });
                this.columnsUpper.push({ header: "CuttingPlan/ShopDrawing | Mat'l | UnitNo", rowspan: 2, style: { "width": CtNoWidth, } });

                for (let month of dbDataSchedule.ColumnsTop) {
                    this.columnsUpper.push({
                        header: month.Name,
                        colspan: month.Value,
                        style: { "width": (month.Value * 35).toString() + "px", }
                    });
                }
                // column Row 2
                this.columnsLower = new Array;

                for (let name of dbDataSchedule.ColumnsLow) {
                    this.columnsLower.push({
                        header: name,
                        // style: { "width": "25px" }
                    });
                }

                // column Main
                this.columns = new Array;

                this.columns.push({
                    header: "MachineNo", field: "MachineNo",
                    style: { "width": McNoWidth }, styleclass: "time-col"
                });
                this.columns.push({ header: "JobNo", field: "JobNo", style: { "width": JbNoWidth, } });

                // debug here
                // console.log("Mode is:", this.mode);
                this.columns.push({ header: "CT/SD", field: "CT/SD", style: { "width": CtNoWidth, } });

                // debug here
                // console.log(JSON.stringify(this.columnsLower));

                let i: number = 0;
                for (let name of dbDataSchedule.ColumnsAll) {
                    if (name.indexOf("Col") >= -1) {
                        this.columns.push({
                            header: this.columnsLower[i], field: name, style: { "width": "35px" }, isCol: true,
                        });
                        i++;
                    }
                }

                this.taskMachines = dbDataSchedule.DataTable.slice();
            }, error => {
                this.columns = new Array;
                this.taskMachines = new Array;
            });
    }

    // load Data Lazy
    loadDataLazy(event: LazyLoadEvent): void {
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        // imitate db connection over a network
        this.publicData.Skip = event.first;
        this.publicData.Take = (event.rows || 5);
        this.onGetTaskMasterSchedule(this.publicData);
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }
}