// angular
import { Component } from "@angular/core";
// models
import { ProjectCodeMaster, ProjectCodeDetail } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { ProjectCodeDetailService } from "../../services/projectcode-detail/projectcode-detail.service";

@Component({
    selector: 'project-view',
    templateUrl: './project-view.component.html',
    styleUrls: ["../../styles/view.style.scss"],
    //providers: [ProjectCodeDetailService]
})
/** project-view component*/
export class ProjectViewComponent extends BaseViewComponent<ProjectCodeMaster>
{
    details: Array<ProjectCodeDetail> = new Array;
    columns = [
        { prop: "ProjectCodeDetailCode", name: "Code", flexGrow:1 },
        { prop: "Description", name: "Description", flexGrow:2 }
    ];

    constructor(
        private service: ProjectCodeDetailService
    ) {
        super();
    }
    // load more data
    onLoadMoreData(value: ProjectCodeMaster) {
        this.service.getByMasterId(value.ProjectCodeMasterId)
            .subscribe(dbDetail => {
                this.details = dbDetail.slice();//[...dbDetail];
                // console.log("DataBase is :", this.details);
            }, error => console.error(error));
    }
}