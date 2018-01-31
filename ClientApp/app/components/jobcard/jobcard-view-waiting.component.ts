// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { JobCardMaster, JobCardDetail, AttachFile } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { JobCardDetailService, JobCardMasterService } from "../../services/service.index";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "jobcard-view-waiting",
    templateUrl: "./jobcard-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})

// jobcard-view component*/
export class JobCardViewWaitingComponent extends BaseViewComponent<JobCardMaster> {
    @Output("selected") selected: EventEmitter<JobCardDetail> = new EventEmitter<JobCardDetail>();
    @Input("mode") mode: boolean = false;


    details: Array<JobCardDetail>;
    attachFiles: Array<AttachFile> = new Array;
    columns: Array<TableColumn> = [
        { prop: "CuttingPlanString", name: "CuttingPlan", flexGrow: 1 },
        { prop: "StandardTimeString", name: "StandardTime", flexGrow: 1 },
        { prop: "Material", name: "Material", flexGrow: 1 },
        { prop: "Quality", name: "Quality", flexGrow: 1 },
        { prop: "UnitsMeasureString", name: "Uom", flexGrow: 1 },
        { prop: "StatusString", name: "Status", flexGrow: 1, cellClass: this.getCellClass}
    ];

    /** jobcard-view ctor */
    constructor(
        private serviceMaster: JobCardMasterService,
        private service: JobCardDetailService
    ) {
        super();
    }
    // load more data
    onLoadMoreData(value: JobCardMaster):void {
        this.service.getByMasterId(value.JobCardMasterId)
            .subscribe(dbDetail => {
                this.details = dbDetail.filter(item => item.JobCardDetailStatus === 1).slice();
            });

        this.serviceMaster.getAttachFile(value.JobCardMasterId)
            .subscribe(dbAttach => this.attachFiles = dbAttach.slice());
    }

    // open attact file
    onOpenNewLink(link: string): void {
        if (link) {
            window.open(link, "_blank");
        }
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        // console.log("getCellClass", value);
        // return {
        //    'is-cancel': value === 'Cancel'
        // };

        if (value === "Complate") {
            return { "is-complate": true };
        } else if (value === "Cancel") {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }

    // emit row selected to output
    onSelect(selected: any): void {
        if (selected) {
            this.selected.emit(selected.selected[0]);
        }
    }
}