// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { OverTimeMaster, OverTimeDetail } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
import { OvertimeViewComponent } from "../../components/overtime/overtime-view.component";
// services
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "overtime-view-waiting",
    templateUrl: "./overtime-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// overtime-view component*/
export class OvertimeViewWaitingComponent extends OvertimeViewComponent {
}