// angular
import { Component } from "@angular/core";
// models
import { CuttingPlan } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services

@Component({
    selector: "cutting-view",
    templateUrl: "./cutting-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
/** cutting-view component*/
export class CuttingViewComponent extends BaseViewComponent<CuttingPlan>
{
    /** cutting-view ctor */
    constructor() {
        super();
    }

    // load more data
    onLoadMoreData(value: CuttingPlan):void {
    }
}