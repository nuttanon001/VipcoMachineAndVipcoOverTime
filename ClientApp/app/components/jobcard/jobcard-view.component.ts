// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { JobCardMaster,JobCardDetail,AttachFile } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { JobCardDetailService,JobCardMasterService } from "../../services/service.index";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "jobcard-view",
    templateUrl: "./jobcard-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})

/** jobcard-view component*/
export class JobCardViewComponent extends BaseViewComponent<JobCardMaster>
{
    @Output("selected") selected: EventEmitter<string> = new EventEmitter<string>();
    @Input("mode") mode: boolean = false;

    details: Array<JobCardDetail>;
    attachFiles: Array<AttachFile> = new Array;
    columns: Array<TableColumn> = [
        { prop: "CuttingPlanString", name: "CuttingPlan", flexGrow: 1 },
        { prop: "Material", name: "Material", flexGrow: 1 },
        { prop: "Quality", name: "Quality", flexGrow: 1 },
        //{ prop: "UnitsMeasureString", name: "Uom", flexGrow: 1 },
        { prop: "StatusString", name: "Status", flexGrow: 1, cellClass: this.getCellClass },
        { prop: "StandardTimeString", name: "StandardTime", flexGrow: 0 }
    ];

    /** jobcard-view ctor */
    constructor(
        private serviceMaster: JobCardMasterService,
        private service : JobCardDetailService
    ) {
        super();
    }
    // load more data
    onLoadMoreData(value: JobCardMaster) {
        this.service.getByMasterId(value.JobCardMasterId,"GetByMasterV2/")
            .subscribe(dbDetail => {
                this.details = dbDetail.slice();
            });

        this.serviceMaster.getAttachFile(value.JobCardMasterId)
            .subscribe(dbAttach => this.attachFiles = dbAttach.slice());
    }

    // open attact file
    onOpenNewLink(link: string): void {
        if (link) {
            window.open("machine/" + link, "_blank");
            //this.serviceMaster.getDownloadFilePaper(link)
            //    .subscribe(data => {
            //        let link: any = document.createElement("a");
            //        link.href = window.URL.createObjectURL(data);
            //        // link.download = "file_";
            //        link.click();
            //    });
        }
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        // console.log("getCellClass", value);
        //return {
        //    'is-cancel': value === 'Cancel'
        //};

        if (value === "Task") {
            return { "is-complate": true };
        } else if (value === "Cancel") {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }
}