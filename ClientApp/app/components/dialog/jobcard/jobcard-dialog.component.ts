import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import {
    JobCardMaster, JobCardDetail,
    Scroll
} from "../../../models/model.index";
// service
import { DataTableServiceCommunicate } from "../../../services/data-table/data-table.service";
import { JobCardMasterService } from "../../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../../services/jobcard-detail/jobcard-detail.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../../pipes/date-only.pipe";

@Component({
    selector: "jobcard-dialog",
    templateUrl: "./jobcard-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        JobCardMasterService,
        JobCardDetailService,
        DataTableServiceCommunicate,
    ]
})
// jobcard-dialog component*/
export class JobcardDialogComponent
    implements OnInit, OnDestroy {
    details: Array<JobCardDetail>;
    templates: Array<JobCardDetail>;
    // detail
    selectedDetail: JobCardDetail | undefined;
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    // subscription
    subscription: Subscription;
    @ViewChild(DatatableComponent) table: DatatableComponent;
    // column
    columns: Array<TableColumn> = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1 },
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 1 },
        { prop: "EmployeeRequireString", name: "Require", flexGrow: 1 },
        { prop: "JobCardDate", name: "Date", pipe: this.datePipe, flexGrow: 1 }
    ];
    columnsDetail: Array<TableColumn> = [
        { prop: "CuttingPlanString", name: "CuttingPlan", flexGrow: 1 },
        { prop: "StandardTimeString", name: "StandardTime", flexGrow: 1 },
        { prop: "Material", name: "Material", flexGrow: 1 },
        // { prop: "Quality", name: "Quality", flexGrow: 1 },
        // { prop: "UnitsMeasureString", name: "Uom", flexGrow: 1 },
    ];
    // property
    get CanSelected(): boolean {
        return this.selectedDetail !== undefined;
    }
    /** jobcard-dialog ctor */
    constructor(
        private serviceMaster: JobCardMasterService,
        private serviceDetail: JobCardDetailService,
        private serviceDataTable: DataTableServiceCommunicate<JobCardMaster>,
        public dialogRef: MatDialogRef<JobcardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public mode: number
    ) { }

    /** Called by Angular after jobcard-dialog component initialized */
    ngOnInit(): void {
        if (!this.details) {
            this.details = new Array;
        }

        this.subscription = this.serviceDataTable.ToParent$
            .subscribe((scroll: Scroll) => this.loadData(scroll));
    }

    // angular hook
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // on get data with lazy load
    loadData(scroll: Scroll): void {
        this.serviceMaster.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // selected Project Master
    onSelectedMaster(master?: JobCardMaster): void {
        if (master) {
            this.serviceDetail.getByMasterId(master.JobCardMasterId)
                .subscribe(dbDetail => {
                    if (this.mode) {
                        this.details = dbDetail.filter(item => item.JobCardDetailStatus === 1).slice();
                    } else {
                        this.details = dbDetail.slice();
                    }
                    this.templates = [...this.details];
                    this.selectedDetail = undefined;
                });

        }
    }

    // selected Project Detail
    onSelectedDetail(selected?: any): void {
        if (selected) {
            this.selectedDetail = selected.selected[0];
            this.onSelectedClick();
        }
    }

    // on Filter
    onFilter(search: string):any {
        // filter our data
        const temp:JobCardDetail[] = this.templates.slice().filter((item, index) => {
            let searchStr:string = ((item.CuttingPlanString || "") + (item.Material || "")).toLowerCase();
            return searchStr.indexOf(search.toLowerCase()) !== -1;
        });

        // update the rows
        this.details = temp;
        // whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selectedDetail);
    }
}