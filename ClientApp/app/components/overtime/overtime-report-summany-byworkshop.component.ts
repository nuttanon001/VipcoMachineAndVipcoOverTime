import { Component, Input } from '@angular/core';

@Component({
    selector: 'overtime-report-summany-byworkshop',
    templateUrl: './overtime-report-summany-byworkshop.component.html',
    styleUrls: ["../../styles/report.style.scss"],
})
/** overtime-report-summany-byworkshop component*/
export class OvertimeReportSummanyByworkshopComponent {
    /** overtime-report-summany-byworkshop ctor */
    constructor() {}

    @Input() overTimeSummary: any;
    @Input() SummaryDate: Date | undefined;
}