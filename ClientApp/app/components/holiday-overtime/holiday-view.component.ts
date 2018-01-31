// angular
import { Component } from "@angular/core";
// models
import { HolidayOverTime } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "holiday-view",
    templateUrl: "./holiday-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// holiday-view component*/
export class HolidayViewComponent
    extends BaseViewComponent<HolidayOverTime>
{
    /** holiday-view ctor */
    constructor() {
        super();
    }

    // load more data
    onLoadMoreData(value: HolidayOverTime) { }
}