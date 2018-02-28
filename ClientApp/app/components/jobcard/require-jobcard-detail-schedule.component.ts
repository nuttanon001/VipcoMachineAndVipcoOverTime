import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// rxjs
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";
// model
import {
    JobCardDetail, JobCardMaster,
    OptionSchedule
} from "../../models/model.index";
// 3rd patry
import { Column, SelectItem, LazyLoadEvent } from "primeng/primeng";
// service
import { JobCardMasterService } from "../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
import { DialogsService } from "../../services/dialog/dialogs.service";
import { AuthService } from "../../services/auth/auth.service";

@Component({
    selector: "require-jobcard-detail-schedule",
    templateUrl: "./require-jobcard-detail-schedule.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// require-painting-schedule component*/
export class RequireJobCardDetailScheduleComponent implements OnInit, OnDestroy {
    /** require-painting-schedule ctor */
    constructor(
        private service: JobCardDetailService,
        private serviceMaster: JobCardMasterService,
        private serviceTypeMachine: TypeMachineService,
        private serviceDialogs: DialogsService,
        private serviceAuth: AuthService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    // Parameter
    // model
    columns: Array<any>;
    requireJobCardDetail: Array<any>;
    typeMachine: Array<SelectItem>;

    scrollHeight: string;
    subscription: Subscription;
    // time
    message: number = 0;
    count: number = 0;
    time: number = 300;
    totalRecords: number;
    // value
    status: number | undefined;
    ProjectString: string;
    schedule: OptionSchedule;
    // form
    reportForm: FormGroup;

    // called by Angular after jobcard-waiting component initialized
    ngOnInit(): void {
        if (window.innerWidth >= 1600) {
            this.scrollHeight = 75 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 68 + "vh";
        } else {
            this.scrollHeight = 65 + "vh";
        }

        this.getTypeMachineArray();
        this.requireJobCardDetail = new Array;
        this.buildForm();
        // Check Cutting plan waiting
        this.serviceMaster.getCheckCuttingPlanWaiting()
            .subscribe();
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
        this.schedule = {};

        this.reportForm = this.fb.group({
            Filter: [this.schedule.Filter],
            ProjectString: [this.ProjectString],
            JobNo: [this.schedule.JobNo],
            Level2: [this.schedule.Level2],
            TypeMachineId: [this.schedule.TypeMachineId],
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
        this.onGetData(this.schedule);
    }

    // get request data
    onGetData(schedule: OptionSchedule): void {
        this.service.postRequireJobCardRequireSchedule(schedule)
            .subscribe(dbDataSchedule => {
                // console.log("Api Send is", dbDataSchedule);

                this.totalRecords = dbDataSchedule.TotalRow;
                this.columns = new Array;

                let ColJobNumberWidth: string = "150px";
                let ColDateWidth: string = "250px";
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

                this.requireJobCardDetail = dbDataSchedule.DataTable.slice();
                // console.log("OverTime is:", this.overtimeMasters);
                this.reloadData();
            }, error => {
                this.columns = new Array;
                this.requireJobCardDetail = new Array;
                this.reloadData();
            });
    }

    // get type machine array
    getTypeMachineArray(): void {
        this.serviceTypeMachine.getAll()
            .subscribe(result => {
                this.typeMachine = new Array;
                this.typeMachine.push({ label: "Selected type machine.", value: undefined });
                for (let item of result) {
                    if (item.TypeMachineCode) {
                        if ((item.TypeMachineCode.indexOf("CM") !== -1) || (item.TypeMachineCode.indexOf("GM") !== -1)) {
                            this.typeMachine.push({ label: item.TypeMachineCode || "", value: item.TypeMachineId });
                        }
                    }
                }
            }, error => console.error(error));
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
                        this.onGetData(this.reportForm.value);
                    }
                }
            });
    }

    // open dialog
    openDialog(type?: string): void {
        if (type) {
            if (type === "Project") {
                this.serviceDialogs.dialogSelectedDetail(this.viewContainerRef)
                    .subscribe(project => {
                        if (project) {
                            this.reportForm.patchValue({
                                Skip: 0,
                                Take: 10,
                                JobNo: project.ProjectCodeMasterId,
                                Level2: project.ProjectCodeDetailId,
                                ProjectString: `${project.FullProjectLevelString}`,
                            });
                        }
                    });
            }
        }
    }

    // reset
    resetFilter(): void {
        this.requireJobCardDetail = new Array;
        this.buildForm();
        this.onGetData(this.schedule);
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
        this.reportForm.patchValue({
            Skip: event.first,
            Take: (event.rows || 10),
        });
    }

    // on selected data
    onSelectJobCardDetail(jobCardDetail?: JobCardDetail): void {
        if (jobCardDetail) {
            if (jobCardDetail.JobCardDetailId) {
                this.serviceDialogs.dialogJobCardDetailAssing(this.viewContainerRef, jobCardDetail.JobCardDetailId)
                    .subscribe((condition: string) => {
                        // debug here
                        console.log(condition);

                        if (condition.indexOf('other') !== -1) {
                            this.router.navigate(["notask-machine/notask-withjob/", jobCardDetail.JobCardDetailId]);
                        } else if (condition.indexOf('machine') !== -1) {
                            // debug here
                            console.log("machine2");
                            this.router.navigate(["task-machine/jobcard-detail/", jobCardDetail.JobCardDetailId]);
                        }
                    });
            }
        }
    }
}