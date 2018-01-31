import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";

@Component({
    selector: "overtime-report",
    templateUrl: "./overtime-report.component.html",
    styleUrls: ["../../styles/report.style.scss"],
})
// overtime-report component*/
export class OverTimeReportComponent implements OnInit {
    @Input("OverTimeMasterId") OverTimeMasterId: number;
    @Input("previewOnly") previewOnly: boolean = false;
    @Output("Back") Back = new EventEmitter<boolean>();
    OverTime: any;
    // overtime-report ctor */
    constructor(
        private service: OverTimeMasterService
    ) { }

    // called by Angular after overtime-report component initialized */
    ngOnInit(): void {
        if (this.OverTimeMasterId) {
            this.service.getReportOverTimePdf2(this.OverTimeMasterId)
                .subscribe(dbReport => {
                    this.OverTime = dbReport;
                    if (!this.previewOnly) {
                        setTimeout(() => {
                            this.onPrintOverTimeMaster();
                        }, 1500);
                        // this.onPrintOverTimeMaster();
                    }
                });
        } else {
            this.onBackToMaster();
        }
    }

    // on Print OverTimeMaster
    onPrintOverTimeMaster(): void {
        window.print();
    }

    // on Back
    onBackToMaster(): void {
        this.Back.emit(true);
    }
}