import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// pipes
import { DateOnlyPipe } from "../../../pipes/date-only.pipe";
// models
import { JobCardMaster,JobCardDetail } from "../../../models/model.index";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// service
import { JobCardDetailService } from "../../../services/jobcard-detail/jobcard-detail.service";
import { JobCardMasterService } from "../../../services/jobcard-master/jobcard-master.service";

@Component({
    selector: "jobcard-detail-assign-dialog",
    templateUrl: "./jobcard-detail-assign-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        JobCardDetailService,
        JobCardMasterService
    ]
})
// jobCard-wating-dialog component*/
export class JobCardDetailAssignDialogComponent implements OnInit {
    jobCardMaster: JobCardMaster;
    jobCardDetail: JobCardDetail;
    // jobCard-wating-dialog ctor */
    constructor(
        private serviceDetail: JobCardDetailService,
        private serviceMaster: JobCardMasterService,
        public dialogRef: MatDialogRef<JobCardDetailAssignDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public jobCardDetailId: number
    ) { }

    // called by Angular after jobCard-wating-dialog component initialized */
    ngOnInit(): void {
        if (this.jobCardDetailId) {
            this.serviceDetail.getOneKeyNumber(this.jobCardDetailId,"GetByKey2/")
                .subscribe(dbJobCardDetail => {
                    this.jobCardDetail = dbJobCardDetail;
                    if (dbJobCardDetail.JobCardMasterId) {
                        this.serviceMaster.getOneKeyNumber(dbJobCardDetail.JobCardMasterId)
                            .subscribe(dbData => this.jobCardMaster = dbData);
                        // debug here
                        // console.log("JobCardMaster:", JSON.stringify(dbJobCardDetail.JobCardMaster));

                        // this.jobCardMaster = Object.assign({}, dbJobCardDetail.JobCardMaster);
                    }
                });
        }
    }

    // on Confirm Click
    onComfirmClick(mode?: string): void {
        if (mode) { // Close Dialog box with send value
            this.dialogRef.close(mode);
        } else { // Close Dialog box
            this.dialogRef.close();
        }
    }
}