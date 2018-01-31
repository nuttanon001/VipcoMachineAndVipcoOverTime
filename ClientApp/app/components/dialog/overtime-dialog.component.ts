import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";
// models
import { OverTimeMaster } from "../../models/model.index";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";


@Component({
    selector: "overtime-dialog",
    templateUrl: "./overtime-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        OverTimeMasterService,
        OverTimeDetailService
    ]
})
/** overtime-dialog component*/
export class OvertimeDialogComponent implements OnInit
{
    onCancel: boolean = false;
    onComplate: boolean = false;
    showContext: boolean;
    status: number;
    message: string;
    overTimeMaster: OverTimeMaster;
    /** overtime-dialog ctor */
    constructor(
        private service: OverTimeMasterService,
        public dialogRef: MatDialogRef<OvertimeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public overTimeMasterId: number
    ) { }

    /** Called by Angular after overtime-dialog component initialized */
    ngOnInit(): void {
        if (this.overTimeMasterId) {
            this.service.getOneKeyNumber(this.overTimeMasterId)
                .subscribe(dbOverTime => {
                    this.overTimeMaster = dbOverTime;
                })
        }
    }

    // show comfirm box
    onShowComfirmBox(mode: number): void {
        if (mode) {
            this.showContext = !this.showContext;
            if (mode === 1) {
                this.status = 2;
                this.message = "Are you want to approve this OverTime-Required ?";
            } else {
                this.status = 4;
                this.message = "Are you want to cancel this OverTime-Required ?";
            }
        }
    }

    // on Click Do action
    onDoAction(): void {
        if (this.status) {
            this.overTimeMaster.OverTimeStatus = this.status;
            this.dialogRef.close(this.overTimeMaster);
        }
    }

    // on Click Cancel
    onCancelDialog(): void {
        this.dialogRef.close();
    }
}