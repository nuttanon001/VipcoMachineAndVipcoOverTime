import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { Employee, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { EmployeeService,EmployeeServiceCommunicate } from "../../services/employee/employee.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "employee-master",
    templateUrl: "./employee-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
// employee-master component*/
export class EmployeeMasterComponent
    extends BaseMasterComponent<Employee, EmployeeService> {
    // columns data table
    columns: Array<TableColumn> = [
        { prop: "EmpCode", name: "Code", flexGrow: 1 },
        { prop: "NameThai", name: "Name", flexGrow: 2 },
        { prop: "GroupName", name: "Group", flexGrow: 1 },
    ];
    // employee-master ctor */
    constructor(
        service: EmployeeService,
        serviceCom: EmployeeServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<Employee>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
        private serverAuth: AuthService,
    ) {
        super(
            service,
            serviceCom,
            serviceComDataTable,
            dialogsService,
            viewContainerRef
        );
    }


    // on change time zone befor update to webapi
    changeTimezone(value: Employee): Employee {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            console.log("Employee:", value);
        }
        return value;
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        if (this.scroll) {
            if (this.scroll.Filter && scroll.Reload) {
                scroll.Filter = this.scroll.Filter;
            }
        }
        // only SubContractor employee
        scroll.Where = "SubContractor";

        this.scroll = scroll;
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on insert data
    onInsertToDataBase(value: Employee): void {
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.editValue.Creator = undefined;
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: Employee): void {
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyString(value, value.EmpCode).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !",
                    "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value: Employee): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyString(value.EmpCode)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }

    // on submit override
    onSubmit(): void {
        this.canSave = false;
        if (this.editValue.InsertOrUpdate) {
            if (this.editValue.InsertOrUpdate === "Update") {
                this.onUpdateToDataBase(this.editValue);
            } else {
                this.onInsertToDataBase(this.editValue);
            }
        }
    }
}