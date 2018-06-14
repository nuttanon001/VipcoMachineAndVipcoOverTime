// angular
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { FormBuilder,FormGroup } from "@angular/forms";
// model
import { OptionOverTimeSchedule,ReportOverTimeSummary } from "../../models/model.index";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
// timezone
import * as moment from "moment-timezone";
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "overtime-report-summary",
    templateUrl: "./overtime-report-summary.component.html",
    styleUrls: ["../../styles/report.style.scss"],
})
// overtime-report-summary component*/
export class OvertimeReportSummaryComponent implements OnInit {
    // overtime-report-summary ctor */
    constructor(
        private service: OverTimeMasterService,
        private fb:FormBuilder
    ) { }
    // Output
    @Output("Back") Back = new EventEmitter<boolean>();
    // Parameter
    onLoad: boolean = false;
    overTimeSummary: any;
    optionSchedule: OptionOverTimeSchedule;
    optionScheduleForm: FormGroup;
    reportOption: Array<SelectItem>;
    // called by Angular after overtime-report component initialized */
    ngOnInit(): void {
        this.optionSchedule = {
            SDate: new Date(),
            ModeReport: 1
        };

        if (!this.reportOption) {
            this.reportOption = new Array;
        }

        this.reportOption.push({ label: "SummanyReportByDate", value: 1 });
        this.reportOption.push({ label: "SummanyReportByWorkShop", value: 2 });
        // Bulid Form
        this.optionScheduleForm = this.fb.group({
            SDate: [this.optionSchedule.SDate],
            EDate: [this.optionSchedule.EDate],
            ModeReport: [this.optionSchedule.ModeReport]
        });
        this.optionScheduleForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
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
    onValueChanged(data?: any): void {
        if (!this.optionScheduleForm) { return; }

        const form: FormGroup = this.optionScheduleForm;
        this.optionSchedule = form.value;
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
        this.overTimeSummary = undefined;
        this.onLoad = true;
        this.service.getReportOverTimeSummary(value, value.ModeReport === 1 ? "GetReportSummary/" : "GetReportSummaryOnlyWorkShop/")
            .subscribe(dbSummary => {
                this.overTimeSummary = dbSummary;
                // console.log(JSON.stringify(this.overTimeSummary));
            }, error => {
                this.overTimeSummary = undefined;
                this.onLoad = false;
            }, () => this.onLoad = false);
    }
}