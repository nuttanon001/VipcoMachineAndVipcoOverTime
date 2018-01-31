import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// rxjs
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";
// model
import { OverTimeMaster, OptionOverTimeSchedule,ProjectCodeMaster } from "../../models/model.index";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
import { EmployeeGroupService } from "../../services/employee-group/employee-group.service";
import { DialogsService } from "../../services/dialog/dialogs.service";
import { AuthService } from "../../services/auth/auth.service";
// 3rd patry
import { Column, SelectItem, LazyLoadEvent } from "primeng/primeng";

@Component({
    selector: "overtime-schedule",
    templateUrl: "./overtime-schedule.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// overtime-schedule component*/
export class OvertimeScheduleComponent implements OnInit, OnDestroy {
    // form
    reportForm: FormGroup;
    // model
    columns: Array<any>;
    overtimeMasters: Array<any>;
    //
    scrollHeight: string;
    subscription: Subscription;
    // time
    message: number = 0;
    count: number = 0;
    time: number = 300;
    totalRecords: number;
    // mode
    status: number | undefined;
    schedule: OptionOverTimeSchedule;
    onloadReport: boolean = false;
    overTimeMaster: OverTimeMaster;
    // array
    proMasters: Array<SelectItem>;
    empGroups: Array<SelectItem>;
    // overtime-schedule ctor */
    constructor(
        private service: OverTimeMasterService,
        private serviceDialogs: DialogsService,
        private serviceProMaster: ProjectCodeMasterService,
        private serviceEmpGroup: EmployeeGroupService,
        private serverAuth: AuthService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    // called by Angular after overtime-schedule component initialized */
    // angular hook
    ngOnInit(): void {
        if (window.innerWidth >= 1600) {
            this.scrollHeight = 75 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 68 + "vh";
        } else {
            this.scrollHeight = 65 + "vh";
        }

        this.overtimeMasters = new Array;

        // this.route.params.subscribe((params: any) => {
        //    let key: number = params["condition"];
        //    if (key) {
        //        if (this.status) {
        //            if (this.status !== key) {
        //                this.status = key;

        //                this.overtimeMasters = new Array;
        //                this.schedule.Status = this.status;
        //                this.onGetOverTimeMasterSechduleData(this.schedule);
        //            }
        //        } else {
        //            this.status = key;
        //        }
        //    }
        // }, error => console.error(error));

        this.buildForm();
        this.getProjectMasterArray();
        this.getEmployeeGroupArray();
    }

    // destroy
    ngOnDestroy(): void {
        if (this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
        }
    }

    // build form
    buildForm(): void {
        this.schedule = {
            Status: this.status || 1,
        };

        if (this.serverAuth.getAuth) {
            this.schedule.Create = this.serverAuth.getAuth.UserName || "";
        }

        this.reportForm = this.fb.group({
            Filter: [this.schedule.Filter],
            GroupCode: [this.schedule.GroupCode],
            ProjectMasterId: [this.schedule.ProjectMasterId],
            Create: [this.schedule.Create],
            SDate: [this.schedule.SDate],
            EDate: [this.schedule.EDate],
            Status: [this.schedule.Status],
            Skip: [this.schedule.Skip],
            Take: [this.schedule.Take],
        });

        this.reportForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
        // this.onValueChanged();
    }

    // on value change
    onValueChanged(data?: any): void {
        if (!this.reportForm) { return; }
        this.schedule = this.reportForm.value;
        this.onGetOverTimeMasterSechduleData(this.schedule);
    }

    // get project master array
    getProjectMasterArray(): void {
        this.serviceProMaster.getAll()
            .subscribe(result => {
                this.proMasters = new Array;
                this.proMasters.push({ label: "Selected job number.", value: undefined });
                let result2:Array<ProjectCodeMaster> = result.sort((a, b) => {
                    if (a.ProjectCode && b.ProjectCode) {
                        if (a.ProjectCode > b.ProjectCode) {
                            return -1;
                        }
                        if (a.ProjectCode < b.ProjectCode) {
                            return 1;
                        }
                    }
                    return 0;
                }).slice();

                for (let item of result2) {
                    this.proMasters.push({ label: item.ProjectCode || "", value: item.ProjectCodeMasterId });
                }
            }, error => console.error(error));
    }

    // get type machine array
    getEmployeeGroupArray(): void {
        this.serviceEmpGroup.getAll()
            .subscribe(result => {
                this.empGroups = new Array;
                this.empGroups.push({ label: "Selected group of employee.", value: undefined });
                for (let item of result) {
                    this.empGroups.push({ label: item.Description || "", value: item.GroupCode });
                }
            }, error => console.error(error));
    }

    // get request data
    onGetOverTimeMasterSechduleData(schedule: OptionOverTimeSchedule): void {
        this.service.getOverTimeMasterSchedule(schedule)
            .subscribe(dbDataSchedule => {
                // console.log("Api Send is", dbDataSchedule);

                this.totalRecords = dbDataSchedule.TotalRow;
                this.columns = new Array;

                let ColJobNumberWidth:string = "290px";
                let ColDateWidth:string = "200px";
                // column Main
                this.columns = new Array;
                this.columns.push({
                    header: "JobNumber", field: "JobNumber",
                    style: { "width": ColJobNumberWidth }, styleclass: "time-col",
                });

                let i: number = 0;
                for (let name of dbDataSchedule.Columns) {
                    this.columns.push({
                        header: name, field: name, style: { "width": ColDateWidth }, isCol: true,
                    });
                }

                this.overtimeMasters = dbDataSchedule.DataTable.slice();
                // console.log("OverTime is:", this.overtimeMasters);
                this.reloadData();
            }, error => {
                this.columns = new Array;
                this.overtimeMasters = new Array;
                this.reloadData();
            });
    }

    // reload data
    reloadData(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = Observable.interval(1000)
            .take(this.time).map((x) => x + 1)
            .subscribe((x) => {
                this.message = this.time - x;
                this.count = (x / this.time) * 100;
                if (x === this.time) {
                    if (this.reportForm.value) {
                        this.onGetOverTimeMasterSechduleData(this.reportForm.value);
                    }
                }
            });
    }

    // on selected data
    onSelectOverTimeMaster(OverTimeMasterId?: number): void {
        if (OverTimeMasterId) {
            // debug here
            // console.log("Data is:", OverTimeMasterId);
            this.serviceDialogs.dialogSelectedOverTimeWaiting(this.viewContainerRef, OverTimeMasterId)
                .subscribe(overtimeMaster => {
                    if (overtimeMaster) {
                        this.onUpdateToDataBase(overtimeMaster);
                    }
                });
        }
    }

    // reset
    resetFilter(): void {
        this.overtimeMasters = new Array;
        this.buildForm();
        this.onGetOverTimeMasterSechduleData(this.schedule);
    }

    // load Data Lazy
    loadDataLazy(event: LazyLoadEvent):void {
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        // imitate db connection over a network

        // console.log("Lazy:", event);

        this.reportForm.patchValue({
            Skip: event.first,
            Take: (event.rows || 10),
        });
    }

    // to DataBase
    // on update data
    onUpdateToDataBase(value: OverTimeMaster): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
            value.EmpApprove = this.serverAuth.getAuth.EmpCode;
        }
        // update data
        this.service.putUpdateStatus(value, value.OverTimeMasterId).subscribe(
            (complete: any) => {
                if (value.OverTimeStatus === 4) {
                    this.serviceDialogs.context("Update Complate", "Cancel overtime was complated.", this.viewContainerRef)
                        .subscribe(gg => this.onGetOverTimeMasterSechduleData(this.schedule));
                } else {
                    this.serviceDialogs.confirm("Update Complate",
                        "Update progress was complated. Do your want to print report Overtime-Require?",
                        this.viewContainerRef)
                        .subscribe(result => {
                            if (result) {
                                this.onReportPrint(complete);
                            } else {
                                this.onGetOverTimeMasterSechduleData(this.schedule);
                            }
                        });
                }
            },
            (error: any) => {
                console.error(error);
                this.serviceDialogs.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!",
                    this.viewContainerRef);
            }
        );
    }

    // reportPdf
    onReportPrint(value?: OverTimeMaster): void {
        if (value) {
            this.overTimeMaster = value;
            this.onloadReport = !this.onloadReport;
        }
    }

    onBackPrint(): void {
        this.onloadReport = !this.onloadReport;
        this.onGetOverTimeMasterSechduleData(this.schedule);
    }
}