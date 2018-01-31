import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// rxjs
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";
// model
import { TaskMachine, OptionSchedule, ProjectCodeMaster, Employee } from "../../models/model.index";
// service
import { TaskMachineService } from "../../services/task-machine/task-machine.service";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
import { DialogsService } from "../../services/dialog/dialogs.service";
import { AuthService } from "../../services/auth/auth.service";
// 3rd patry
import { Column, SelectItem, LazyLoadEvent } from "primeng/primeng";

@Component({
    selector: "task-machine-schedule",
    templateUrl: "./task-machine-schedule.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// task-machine-schedule component*/
export class TaskMachineScheduleComponent implements OnInit, OnDestroy {
    // form
    reportForm: FormGroup;
    // model
    columnsUpper: Array<any>;
    columnsLower: Array<any>;
    columns: Array<any>;
    taskMachines: Array<any>;
    //
    scrollHeight: string;
    subscription: Subscription;
    // time
    message: number = 0;
    count: number = 0;
    time: number = 300;
    totalRecords: number;
    // mode
    mode: number | undefined;
    schedule: OptionSchedule;
    taskMachineId: number | undefined;
    showForm: boolean;
    // array
    proMasters: Array<SelectItem>;
    proDetails: Array<SelectItem>;
    typeMachine: Array<SelectItem>;
    workGroup: Array<SelectItem>;
    //  task-machine-schedule ctor */
    constructor(
        private service: TaskMachineService,
        private serviceDialogs: DialogsService,
        private serviceProMaster: ProjectCodeMasterService,
        private serviceProDetail: ProjectCodeDetailEditService,
        private serviceTypeMachine: TypeMachineService,
        private serviceAuth: AuthService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,
        public route: ActivatedRoute,
    ) { }

    // angular hook
    ngOnInit(): void {
        if(window.innerWidth >= 1600) {
            this.scrollHeight = 75 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 68 + "vh";
        } else {
            this.scrollHeight = 65 + "vh";
        }

        this.taskMachines = new Array;
        this.showForm = true;

        this.route.paramMap.subscribe((param: ParamMap) => {
            let key: number = Number(param.get("condition") || 0);

            if (key) {
                this.mode = key;

                let schedule: OptionSchedule = {
                    Mode: this.mode
                };

                if (this.serviceAuth.getAuth) {
                    if (this.mode === 1) {
                        schedule.Creator = this.serviceAuth.getAuth.EmpCode;
                        schedule.CreatorName = this.serviceAuth.getAuth.NameThai;
                    }
                }

                this.buildForm(schedule);
                this.getProjectMasterArray();
                this.getTypeMachineArray();
                this.getWorkGroupArray();
                this.proDetails = new Array;
                this.proDetails.push({ label: "Selected level2/3", value: undefined });
            }
        }, error => console.error(error));

        // this.route.params.subscribe((params: any) => {
        //    let key: number = params["condition"];
        //    // console.log("key is",key);
        //    if (key) {
        //        this.mode = key;
        //        this.buildForm();
        //        this.getProjectMasterArray();
        //        this.getTypeMachineArray();
        //        this.proDetails = new Array;
        //        this.proDetails.push({ label: "Selected level2/3", value: undefined });
        //    }
        // }, error => console.error(error));
    }

    // destroy
    ngOnDestroy():void {
        if(this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
        }
    }

    // build form
    buildForm(schedule?: OptionSchedule): void {
        if (!schedule) {
            schedule = {
                Mode: this.mode || 2,
            };
        }
        this.schedule = schedule;

        this.reportForm = this.fb.group({
            Filter: [this.schedule.Filter],
            JobNo: [this.schedule.JobNo],
            Level2: [this.schedule.Level2],
            Mode: [this.schedule.Mode],
            Skip: [this.schedule.Skip],
            Take: [this.schedule.Take],
            TypeMachineId: [this.schedule.TypeMachineId],
            Creator: [this.schedule.Creator],
            Require: [this.schedule.Require],
            // template
            CreatorName: [this.schedule.CreatorName],
            RequireName: [this.schedule.RequireName],
        });

        this.reportForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
        this.onValueChanged();
    }

    // on value change
    onValueChanged(data?: any): void {
        if (!this.reportForm) { return; }

        this.schedule = this.reportForm.value;
        if (this.schedule.JobNo) {
            this.getProjectDetailArray(this.schedule.JobNo);
        }

        this.onGetTaskMachineWaitAndProcessData(this.schedule);
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

    // get project detail array
    getProjectDetailArray(ProMasterId: number): void {
        this.serviceProDetail.getByMasterId(ProMasterId)
            .subscribe(result => {
                this.proDetails = new Array;
                this.proDetails.push({ label: "Selected level2/3", value: undefined });

                for (let item of result) {
                    this.proDetails.push({ label: item.ProjectCodeDetailCode || "", value: item.ProjectCodeDetailId });
                }
            }, error => console.error(error));
    }

    // get type machine array
    getTypeMachineArray(): void {
        this.serviceTypeMachine.getAll()
            .subscribe(result => {
                this.typeMachine = new Array;
                this.typeMachine.push({ label: "Selected type machine.", value: undefined });
                for (let item of result) {
                    this.typeMachine.push({ label: item.TypeMachineCode || "", value: item.TypeMachineId });
                }
            }, error => console.error(error));
    }

    // get WorkGroup array
    getWorkGroupArray(): void {
        this.service.getWorkGroupOnlyHasJobCardMaster()
            .subscribe(result => {
                this.workGroup = new Array;
                this.workGroup.push({ label: "Selected work group.", value: undefined });
                for (let item of result) {
                    this.workGroup.push({ label: item.Description || "", value: item.GroupCode });
                }
            }, error => console.error(error));
    }

    // get request data
    onGetTaskMachineWaitAndProcessData(schedule: OptionSchedule): void {
        if (this.taskMachineId) {
            schedule.TaskMachineId = this.taskMachineId;
        }

        this.service.getTaskMachineWaitAndProcess(schedule)
            .subscribe(dbDataSchedule => {
                this.totalRecords = dbDataSchedule.TotalRow;

                this.columns = new Array;
                this.columnsUpper = new Array;

                let McNoWidth:string = "100px";
                let JbNoWidth: string = "170px";
                let CtNoWidth: string = "350px";
                let NumWidth: string = "55px";

                // column Row1
                this.columnsUpper.push({ header: "MachineNo", rowspan: 2, style: { "width": McNoWidth, }});
                this.columnsUpper.push({ header: "JobNo", rowspan: 2, style: { "width": JbNoWidth, } });
                this.columnsUpper.push({ header: "CuttingPlan/ShopDrawing | Mat'l | UnitNo", rowspan: 2, style: { "width": CtNoWidth, } });
                this.columnsUpper.push({ header: "Qty", rowspan: 2, style: { "width": NumWidth, } });
                this.columnsUpper.push({ header: "Pro", rowspan: 2, style: { "width": NumWidth, } });
                this.columnsUpper.push({ header: "Per", rowspan: 2, style: { "width": NumWidth, } });

                for (let month of dbDataSchedule.ColumnsTop) {
                        this.columnsUpper.push({
                            header: month.Name,
                            colspan: month.Value,
                            style: { "width": (month.Value*35).toString() +"px", }
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

                if (this.mode) {
                    if (this.mode > 1) {
                        // debug here
                        // console.log("Mode is 2:", this.mode);
                        this.columns.push({
                            header: "CT/SD", field: "CT/SD",
                            style: { "width": CtNoWidth, }, isLink: true
                        });
                    } else {
                        // debug here
                        // console.log("Mode is 3:", this.mode);
                        this.columns.push({ header: "CT/SD", field: "CT/SD", style: { "width": CtNoWidth, } });
                    }
                } else {
                    // debug here
                    // console.log("Mode is 4:", this.mode);
                    this.columns.push({ header: "CT/SD", field: "CT/SD", style: { "width": CtNoWidth, } });
                }
                this.columns.push({ header: "Qty", field: "Qty", style: { "width": NumWidth, } });
                this.columns.push({ header: "Pro", field: "Pro", style: { "width": NumWidth, } });
                this.columns.push({ header: "Per", field: "Progess", style: { "width": NumWidth, } });

                // debug here
                // console.log(JSON.stringify(this.columnsLower));

                let i: number = 0;
                for (let name of dbDataSchedule.ColumnsAll) {
                    if (name.indexOf("Col") >= -1) {
                        this.columns.push({
                            header: this.columnsLower[i] ,field: name, style: { "width": "35px" }, isCol: true ,
                        });
                        i++;
                    }
                }
                // debug here
                // console.log(JSON.stringify(this.columns));
                // debug here
                // console.log(JSON.stringify(dbDataSchedule.DataTable));

                this.taskMachines = dbDataSchedule.DataTable.slice();

                this.reloadData();
            }, error => {
                this.columns = new Array;
                this.taskMachines = new Array;
                this.reloadData();
            });
    }

    // reload data
    reloadData(): void {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = Observable.interval(1000)
            .take(this.time).map((x) => x + 1)
            .subscribe((x) => {
                this.message = this.time - x;
                this.count = (x / this.time) * 100;
                if (x === this.time) {
                    if (this.reportForm.value) {
                        console.log("reportForm :", this.reportForm.value);
                        this.onGetTaskMachineWaitAndProcessData(this.reportForm.value);
                    }
                }
            });
    }

    // on selected data
    onSelectTaskMachineId(TaskMachineId: any): void {
        // debug here
        // console.log("Data is:", TaskMachineId);
        if (TaskMachineId) {
            this.serviceDialogs.dialogUpdateProgessTaskMachine(this.viewContainerRef, TaskMachineId)
                .subscribe(update => {
                    if (update) {
                        this.serviceDialogs.context("Update Complate", "Update progress was complated.", this.viewContainerRef);
                        this.onGetTaskMachineWaitAndProcessData(this.schedule);
                    }
                });
        }
    }

    // reset
    resetFilter(): void {
        this.taskMachines = new Array;
        this.buildForm();
        this.onGetTaskMachineWaitAndProcessData(this.schedule);
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

        this.reportForm.patchValue({
            Skip: event.first,
            // mark Take: ((event.first || 0) + (event.rows || 4)),
            Take: (event.rows || 5),
        });
    }

    // on select dialog
    onShowDialog(mode?:string): void {
        if (mode) {
            if (mode === "e") {
                this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef, "singe")
                    .subscribe(employee => {
                        if (employee) {
                            let emp: Employee = Object.assign({}, employee[0]);
                            this.reportForm.patchValue({
                                Creator: emp.EmpCode,
                                CreatorName: emp.NameThai,
                            });
                        } else {
                            this.reportForm.patchValue({
                                Creator: "",
                                CreatorName: "",
                            });
                        }
                    });
            } else {
                this.serviceDialogs.dialogSelectedEmployeeGroup(this.viewContainerRef)
                    .subscribe(group => {
                        this.reportForm.patchValue({
                            Require: group ? group.GroupCode : "",
                            RequireName: group ? group.Description : "",
                        });
                    });
            }
        }
    }
}