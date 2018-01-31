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
import { JobCardMasterService } from "../../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../../services/jobcard-detail/jobcard-detail.service";

@Component({
    selector: "job-card-wating-dialog",
    templateUrl: "./jobcard-wating-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        JobCardMasterService,
        JobCardDetailService
    ]
})
// jobCard-wating-dialog component*/
export class JobCardWatingDialogComponent implements OnInit {
    onCancel: boolean = false;
    onComplate: boolean = false;
    showContext: boolean = false;
    status: number;
    message: string;

    selected: JobCardMaster;
    columns: Array<TableColumn> = [
        { prop: "JobCardMasterNo", name: "No.", width: 75 },
        { prop: "ProjectDetailString", name: "Job Level2/3", width: 210 },
    ];
    // jobCard-wating-dialog ctor */
    constructor(
        private service : JobCardMasterService,
        public dialogRef: MatDialogRef<JobCardWatingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public jobCardMasters: Array<JobCardMaster>
    ) { }

    // called by Angular after jobCard-wating-dialog component initialized */
    ngOnInit(): void {
        if (this.jobCardMasters) {
            this.onSelectedJobCardMasterSet(this.jobCardMasters[0]);
        }
    }

    onSelectedJobCardMasterSet(value: JobCardMaster): void {
        if (value) {
            this.service.getCuttingPlanToJobCardDetail(value.JobCardMasterId)
                .subscribe(undefined,
                Error => {
                    // console.log("Error :");

                    this.service.getOneKeyNumber(value.JobCardMasterId)
                        .subscribe(dbData => {
                            this.selected = dbData;
                            this.onCheckCancel();
                            this.onCheckComplate();
                        });
                }, () => {
                    // console.log("Complete :");

                    this.service.getOneKeyNumber(value.JobCardMasterId)
                        .subscribe(dbData => {
                            this.selected = dbData;
                            this.onCheckCancel();
                            this.onCheckComplate();
                        });
                });
        }

    }

    // selected JobCardMaster
    onSelectedJobCardMaster(selected: any): void {
        if (selected) {
            this.onSelectedJobCardMasterSet(selected.selected[0]);
        }
    }

    // selected JobCardDetail
    onSelectedJobCardDetail(jobCardDetail?: JobCardDetail): void {
        // debug here
        // console.log("JobCardDetail: ", jobCardDetail);
        this.dialogRef.close(jobCardDetail);
    }

    // show comfirm box
    onShowComfirmBox(mode: number): void {
        if (mode) {
            this.showContext = !this.showContext;
            this.status = mode;
            if (mode === 3) {
                this.message = "Are you want to cancel this Machine-Required ?";
            } else {
                this.message = "Are you want to complate this Machine-Required ?";
            }
        }
    }

    // check Can Cancel
    onCheckCancel(): void {
        if (this.selected) {
            this.service.getCheckJobCardCanCancel(this.selected.JobCardMasterId)
                .subscribe(result => {
                    // console.log(result);
                    this.onCancel = result.Result;
                }, Error => this.onCancel = false);
        } else {
            this.onCancel = false;
        }
    }

    // check Can Cancel
    onCheckComplate(): void {
        if (this.selected) {
            this.service.getCheckJobCardCanComplate(this.selected.JobCardMasterId)
                .subscribe(result => {
                    // console.log(result);
                    this.onComplate = result.Result;
                }, Error => this.onCancel = false);
        } else {
            this.onCancel = false;
        }
    }

    // on Cancel JobCardDetail
    onChangeStatusJobCard(): void {
        if (this.selected && this.status) {
            this.service.getChangeStatusJobCardMaster(this.selected.JobCardMasterId,this.status)
                .subscribe(dbUpdate => {
                    // send -99 for reload data
                    let result1: JobCardDetail = {
                        JobCardDetailId: -99
                    };
                    this.dialogRef.close(result1);
                }, Error => console.error(Error));
        }
    }

    // on Add or Edit JobCard
    onAddOrEditJobCard(mode: number): void {
        if (this.selected) {
            let result1: JobCardDetail = {
                JobCardDetailId: mode,
                JobCardMasterId: this.selected.JobCardMasterId
            };
            this.dialogRef.close(result1);
        }
    }

    // no Click
    onCancelDialog(): void {
        this.dialogRef.close();
    }
}