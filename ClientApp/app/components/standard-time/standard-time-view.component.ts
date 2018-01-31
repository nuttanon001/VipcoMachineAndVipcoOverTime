// angular
import { Component } from "@angular/core";
// models
import { TypeStandardTime, StandardTime } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { StandardTimeService } from "../../services/standard-time/standard-time.service";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "standard-time-view",
    templateUrl: "./standard-time-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
/** standard-time-view component*/
export class StandardTimeViewComponent
    extends BaseViewComponent<TypeStandardTime>
{
    standards: Array<StandardTime> = new Array;
    columns:Array<TableColumn> = [
        { prop: "GradeMaterialString", name: "Grade", flexGrow: 1 },
        { prop: "StandardTimeCode", name: "Code", flexGrow: 1 },
        { prop: "Description", name: "Spec", flexGrow: 3 },
        { prop: "StandardTimeValue", name: "Use(Min.)", flexGrow: 1 },
        { prop: "PreparationBefor", name: "Befor(Min.)", flexGrow: 1 },
        { prop: "PreparationAfter", name: "After(Min.)", flexGrow: 1 },
    ];
    /** standard-time-view ctor */
    constructor(
        private service: StandardTimeService
    ) {
        super();
    }

    // load more data
    onLoadMoreData(value: TypeStandardTime) {
        this.service.getByMasterId(value.TypeStandardTimeId)
            .subscribe(dbStandard => {
                this.standards = dbStandard.slice();//[...dbDetail];
                // console.log("DataBase is :", this.details);
            }, error => console.error(error));
    }
}