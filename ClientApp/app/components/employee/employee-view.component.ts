// angular
import { Component } from "@angular/core";
// models
import { Employee, EmployeeGroup } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { EmployeeGroupService } from "../../services/employee-group/employee-group.service";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "employee-view",
    templateUrl: "./employee-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// employee-view component*/
export class EmployeeViewComponent
    extends BaseViewComponent<Employee> {
    /** employee-view ctor */
    constructor(
        private service: EmployeeGroupService
    ) {
        super();
    }

    // load more data
    onLoadMoreData(value: Employee):void {
        // load more data here
    }
}