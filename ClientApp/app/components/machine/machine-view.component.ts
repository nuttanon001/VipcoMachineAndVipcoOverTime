// angular
import { Component } from "@angular/core";
// models
import { Machine,MachineHasOperator } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { MachineHasOperatorService } from "../../services/machine-has-operator/machine-has-operator.service";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "machine-view",
    templateUrl: "./machine-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// machine-view component*/
export class MachineViewComponent
    extends BaseViewComponent<Machine>
{
    details: Array<MachineHasOperator> = new Array;
    columns: Array<TableColumn> = [
        { prop: "EmpCode", name: "Code", flexGrow: 1 },
        { prop: "EmployeeName", name: "Name", flexGrow: 2 }
    ];
    /** machine-view ctor */
    constructor(
        private service: MachineHasOperatorService
    ) {
        super();
    }

    // load more data
    onLoadMoreData(value: Machine) {
        this.service.getByMasterId(value.MachineId)
            .subscribe(dbDetail => {
                this.details = dbDetail.slice();//[...dbDetail];
                // console.log("DataBase is :", this.details);
            }, error => console.error(error));
    }
}