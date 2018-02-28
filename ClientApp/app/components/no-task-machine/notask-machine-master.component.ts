import { Component, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { NoTaskMachine, Scroll, ScrollData } from "../../models/model.index";
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
    selector: "notask-machine-master",
    templateUrl: "./notask-machine-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        DataTableServiceCommunicate,
        TaskMachineServiceCommunicate
    ]
})
// notask-machine-master component*/
export class NoTaskMachineMasterComponent 
    extends BaseMasterComponent<NoTaskMachine, TaskMachineService> {

  
    /** notask-machine-master ctor */
    constructor(
        service: TaskMachineService,
        serviceCom: TaskMachineServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<NoTaskMachine>,
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

    // parameter
    onlyUser: boolean;
    goToSchedule: boolean;
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    hasOverTime: boolean = false;
    columns: Array<TableColumn> = [
        { prop: "NoTaskMachineCode", name: "Code", flexGrow: 1 },
        { prop: "GroupMisString", name: "Group", flexGrow: 2 },
        { prop: "CuttingPlanNo", name: "CuttingPlan", flexGrow: 2 },
        { prop: "Date", name: "Date", pipe: this.datePipe, flexGrow: 1 },
    ];

    // on inti override
    ngOnInit(): void {
        this.onlyUser = true;
        this.goToSchedule = false;

        // override class
        super.ngOnInit();

        this.route.paramMap.subscribe((param: ParamMap) => {
            let key: number = Number(param.get("condition") || 0);
            this.goToSchedule = true;

            if (key) {
                let newTaskMachine: NoTaskMachine = {
                    NoTaskMachineId: 0,
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
        this.service.getAllWithScrollNoTaskMachine(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: NoTaskMachine): NoTaskMachine {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.Date !== null) {
                value.Date = moment.tz(value.Date, zone).toDate();
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: NoTaskMachine): void {
        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        } else {
            this.dialogsService.error("Error Message", "บัญชีผู้ใช้งาน ขาดการติดต่อกับระบบ โปรดล็อคอินใหม่ !!!", this.viewContainerRef);
            return;
        }
        // change timezone
        value = this.changeTimezone(value);

        // insert data
        this.service.postNoTaskMachine(value).subscribe(
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
    onUpdateToDataBase(value: NoTaskMachine): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);

        // update data
        this.service.putNoTaskMachineKeyNumber(value, value.NoTaskMachineId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            }, (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value?: NoTaskMachine): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getNoTaskMachineOneKeyNumber(value.NoTaskMachineId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }

    // onSaveComplate OverRide
    onSaveComplete(): void {
        this.dialogsService
            .context("System message", "Save completed.", this.viewContainerRef)
            .subscribe(result => {
                this.canSave = false;
                this.ShowEdit = false;
                this.editValue = undefined;
                this.onDetailView(undefined);

                if (this.goToSchedule) {
                    this.router.navigate(["/jobcard/require-jobcard-detail-schedule/"]);
                }
                setTimeout(() => {
                    this.dataTableServiceCom.toReload(true);
                }, 150);
            });
    }
}