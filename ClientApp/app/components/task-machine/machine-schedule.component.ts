// Angular Core
import { Component, ViewContainerRef,Input,OnChanges} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// Component
import { TaskMachineScheduleComponent } from './task-machine-schedule.component';
// Model
import { OptionSchedule } from '../../models/model.index';
// Service
import { TaskMachineService } from "../../services/task-machine/task-machine.service";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
import { DialogsService } from "../../services/dialog/dialogs.service";
import { AuthService } from "../../services/auth/auth.service";
import * as moment from "moment-timezone";


@Component({
    selector: 'machine-schedule',
    templateUrl: "./task-machine-schedule.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
/** machine-schedule component*/
export class MachineScheduleComponent extends TaskMachineScheduleComponent implements OnChanges {
    /** machine-schedule ctor */
    constructor(
        service: TaskMachineService,
        serviceDialogs: DialogsService,
        serviceProMaster: ProjectCodeMasterService,
        serviceProDetail: ProjectCodeDetailEditService,
        serviceTypeMachine: TypeMachineService,
        serviceAuth: AuthService,
        viewContainerRef: ViewContainerRef,
        fb: FormBuilder,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(
            service,
            serviceDialogs,
            serviceProMaster,
            serviceProDetail,
            serviceTypeMachine,
            serviceAuth,
            viewContainerRef,
            fb,
            router,
            route
        );
    }
    // Parament
    @Input() SetTypeMachine: number;
    @Input() SetPickDate: Date;

    machineSchedule: boolean = true;
    // OverRide
    // angular hook
    ngOnInit(): void {
        if (window.innerWidth >= 1600) {
            this.scrollHeight = 65 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 55 + "vh";
        } else {
            this.scrollHeight = 52 + "vh";
        }

        this.take = 20;
        this.taskMachines = new Array;
        this.showForm = true;
        //if have condition
        this.route.paramMap.subscribe((param: ParamMap) => {
            let key: number = Number(param.get("condition") || 0);

            if (key) {
                this.mode = key;

                let schedule: OptionSchedule = {
                    Mode: this.mode,
                    PickDate: new Date,
                };

                this.buildForm(schedule);
                this.getTypeMachineArray();
            }
        }, error => console.error(error));

        let schedule: OptionSchedule = {
            Mode: this.mode,
            PickDate: new Date,
        };

        this.buildForm(schedule);
        this.getTypeMachineArray();
    }

    ngOnChanges(): void {
        if (this.SetTypeMachine) {
            if (this.reportForm) {
                this.reportForm.patchValue({
                    TypeMachineId:this.SetTypeMachine
                });
                // debug here
                // console.log("SetTypeMachine");
            }
        }

        if (this.SetPickDate) {
            if (this.reportForm) {
                this.reportForm.patchValue({
                    PickDate: this.SetPickDate
                });
                // debug here
                // console.log("SetPickDate");
            }
        }
    }

    // get request data
    onGetTaskMachineWaitAndProcessData(schedule: OptionSchedule): void {
        let zone: string = "Asia/Bangkok";
        if (schedule.PickDate !== null) {
            schedule.PickDate = moment.tz(schedule.PickDate, zone).toDate();
        }

        this.service.getTaskMachineWaitAndProcess(schedule,"MachineSchedule/")
            .subscribe(dbDataSchedule => this.onSetDataTable(dbDataSchedule), error => {
                this.columns = new Array;
                this.taskMachines = new Array;
                this.reloadData();
            });
    }

    // on value change
    onValueChanged(data?: any): void {
        if (!this.reportForm) { return; }
        // console.log("onValueChanged");

        this.schedule = this.reportForm.value;
        this.onGetTaskMachineWaitAndProcessData(this.schedule);
    }

    // machine
    onSelectedMachine(): void {
        let mode: number = 0;
        if (this.reportForm) {
            let controlTypeMachine = this.reportForm.get("TypeMachineId");
            if (controlTypeMachine) {
                if (controlTypeMachine.value) {
                    mode = controlTypeMachine.value;
                }
            }
        }
        this.serviceDialogs.dialogSelectMachine(this.viewContainerRef, mode)
            .subscribe(machine => {
                if (machine) {
                    this.reportForm.patchValue({
                        MachineId: machine.MachineId,
                        MachineCode: `${machine.MachineCode}`,
                        TypeMachineId: machine.TypeMachineId,
                    });
                } else {
                    this.reportForm.patchValue({
                        MachineId: undefined,
                        MachineCode: ""
                    });
                }
            });
    }
}