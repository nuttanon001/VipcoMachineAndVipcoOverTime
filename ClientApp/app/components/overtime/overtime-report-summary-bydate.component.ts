import { Component, Input } from '@angular/core';

@Component({
    selector: 'overtime-report-summary-bydate',
    templateUrl: './overtime-report-summary-bydate.component.html',
    styleUrls: ["../../styles/report.style.scss"],
})
/** overtime-report-summary-bydate component*/
export class OvertimeReportSummaryBydateComponent {
    /** overtime-report-summary-bydate ctor */
    constructor() {
    }

    @Input() overTimeSummary: any;
    @Input() SummaryDate: Date|undefined;
}