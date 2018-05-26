// angular
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
// model
import { OptionOverTimeSchedule, ReportOverTimeSummary } from "../../models/model.index";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
// timezone
import * as moment from "moment-timezone";
import { SelectItem } from "primeng/primeng";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
@Component({
    selector: "overtime-report-summary-bypro",
    templateUrl: "./overtime-report-summary-bypro.component.html",
    styleUrls: ["../../styles/report.style.scss"],
})
// overtime-report-summary component*/
export class OverTimeReportSummaryByProComponent implements OnInit {
    @Output("Back") Back = new EventEmitter<boolean>();
    projectMasters: Array<SelectItem> | undefined;
    selectProjectmaster: Array<SelectItem> | undefined;
    overTimeSummary: any;
    // overtime-report-summary ctor */
    constructor(
        private service: OverTimeMasterService,
        private serviceProjectMaster:ProjectCodeMasterService,
    ) { }

    // called by Angular after overtime-report component initialized */
    ngOnInit(): void {
        this.getProjectMaster();
        // this.onGetReportSummaryData();
    }

    // get project master array
    getProjectMaster(): void {
        this.serviceProjectMaster.getAll()
            .subscribe(dbData => {
                this.projectMasters = new Array;
                this.projectMasters.push({ label: "Selected Job-Number.", value: undefined });
                for (let item of dbData) {
                    this.projectMasters.push({ label: `${item.ProjectCode}/${item.ProjectName}`, value: item.ProjectCodeMasterId });
                }
            }, error => console.error(error));
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
    onSubmitChange(data?: any): void {
        this.onGetReportSummaryData();
    }

    // on Get Report Data
    onGetReportSummaryData(): void {
        let projectList: Array<number | null> = new Array;

        if (this.selectProjectmaster) {
            this.selectProjectmaster.forEach((item, index) => {
                let jobNumber: any = item;
                projectList.push(jobNumber);
            });
        }

        if (projectList) {
            this.service.getReportOverTimeSummaryByPro(projectList)
                .subscribe(dbSummary => {
                    this.overTimeSummary = dbSummary;
                }, error => this.overTimeSummary = undefined);
        }
    }
}