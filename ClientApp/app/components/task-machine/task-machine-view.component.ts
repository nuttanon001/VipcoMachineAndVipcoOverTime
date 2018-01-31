// angular
import { Component } from "@angular/core";
// models
import {
    TaskMachine, TaskMachineHasOverTime,
    JobCardDetail, AttachFile
} from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { TaskMachineHasOverTimeService } from "../../services/over-time/over-time.service";
import { JobCardMasterService } from "../../services/service.index";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "task-machine-view",
    templateUrl: "./task-machine-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// task-machine-view component*/
export class TaskMachineViewComponent extends BaseViewComponent<TaskMachine> {
    // parameter
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    jobCardDetail: JobCardDetail | undefined;
    overtimes: Array<TaskMachineHasOverTime> = new Array;
    attachFiles: Array<AttachFile> = new Array;
    columns: Array<TableColumn> = [
        { prop: "OverTimeDate", name: "OT/Date", pipe:this.datePipe, flexGrow: 1 },
        { prop: "OverTimePerDate", name: "Hours", flexGrow: 1 },
        { prop: "NameThai", name : "Employee",flexGrow:1 },
    ];

    /** task-machine-view ctor */
    constructor(
        private service: TaskMachineHasOverTimeService,
        private serviceJobCardDetail: JobCardDetailService,
        private serviceJobCardMaster: JobCardMasterService
    ) {
        super();
    }

    // load more data
    onLoadMoreData(value: TaskMachine) {
        this.service.getByMasterId(value.TaskMachineId)
            .subscribe(dbOverTimes => {
                this.overtimes = dbOverTimes.slice();//[...dbDetail];
                // console.log("DataBase is :", this.details);
            }, error => console.error(error));

        if (value.JobCardDetailId) {
            this.serviceJobCardDetail.getOneKeyNumber(value.JobCardDetailId)
                .subscribe(dbJobCard => {
                    this.jobCardDetail = dbJobCard
                    //get Attach
                    if(this.jobCardDetail) {
                        if (this.jobCardDetail.JobCardMasterId) {
                            this.serviceJobCardMaster.getAttachFile(this.jobCardDetail.JobCardMasterId)
                                .subscribe(dbAttach => {
                                    this.attachFiles = dbAttach.slice();
                                }, error => console.error(error));
                        }
                    }
                });
        }
    }

    // open attact file
    onOpenNewLink(link: string): void {
        if (link) {
            window.open(link, "_blank");
        }
    }
}