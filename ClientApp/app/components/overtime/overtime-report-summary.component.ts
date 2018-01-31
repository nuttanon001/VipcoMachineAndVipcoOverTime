// angular
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
// model
import { OptionOverTimeSchedule,ReportOverTimeSummary } from "../../models/model.index";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
// timezone
import * as moment from "moment-timezone";
@Component({
    selector: "overtime-report-summary",
    templateUrl: "./overtime-report-summary.component.html",
    styleUrls: ["../../styles/report.style.scss"],
})
// overtime-report-summary component*/
export class OvertimeReportSummaryComponent implements OnInit {
    @Output("Back") Back = new EventEmitter<boolean>();
    overTimeSummary: any;
    optionSchedule: OptionOverTimeSchedule;
    SummaryDate: Date = new Date();
    // overtime-report-summary ctor */
    constructor(
        private service: OverTimeMasterService
    ) { }

    // called by Angular after overtime-report component initialized */
    ngOnInit(): void {
        this.optionSchedule = {
            SDate : this.SummaryDate
        };
        this.onGetReportSummaryData();
    }

    // on Print OverTimeMaster
    onPrintOverTimeMaster(): void {
        window.print();
    }

    // on Back
    onBackToMaster(): void {
        this.Back.emit(true);
    }

    // on DateChange
    onDateChange(data?: any): void {
        this.optionSchedule.SDate = this.SummaryDate;
        this.onGetReportSummaryData();
    }

    // on Get Report Data
    onGetReportSummaryData(): void {
        let zone: string = "Asia/Bangkok";
        let value: OptionOverTimeSchedule = this.optionSchedule;

        if (value !== null) {
            if (value.SDate !== null) {
                value.SDate = moment.tz(value.SDate, zone).toDate();
            }
            if (value.EDate !== null) {
                value.EDate = moment.tz(value.EDate, zone).toDate();
            }
        }


        this.service.getReportOverTimeSummary(value)
            .subscribe(dbSummary => {
                this.overTimeSummary = dbSummary;
            }, error => this.overTimeSummary = undefined);
    }
}