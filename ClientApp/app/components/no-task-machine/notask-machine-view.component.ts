// angular
import { Component } from "@angular/core";
// models
import {
    NoTaskMachine, JobCardDetail
} from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { JobCardMasterService } from "../../services/service.index";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "notask-machine-view",
    templateUrl: "./notask-machine-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// notask-machine-view component*/
export class NoTaskMachineViewComponent extends BaseViewComponent<NoTaskMachine> {
    // parameter
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    jobCardDetail: JobCardDetail | undefined;

    /** notask-machine-view ctor */
    constructor(
        private serviceJobCardDetail: JobCardDetailService,
    ) {
        super();
    }

    // load more data
    onLoadMoreData(value: NoTaskMachine) {
        if (value.JobCardDetailId) {
            this.serviceJobCardDetail.getOneKeyNumber(value.JobCardDetailId)
                .subscribe(dbJobCard => {
                    this.jobCardDetail = dbJobCard;
                });
        }
    }
}