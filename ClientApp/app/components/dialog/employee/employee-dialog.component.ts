import { Component, OnInit, OnDestroy ,Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
// import { Employee, Scroll } from "../../models/model.index";
import { Employee } from "../../../models/employee/employee.model";
import { Scroll } from "../../../models/page/page.model";
// service
import { DataTableServiceCommunicate } from "../../../services/data-table/data-table.service";
import { EmployeeService } from "../../../services/employee/employee.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "employee-dialog",
    templateUrl: "./employee-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        EmployeeService,
        DataTableServiceCommunicate,
    ]
})
// employee-dialog component*/
export class EmployeeDialogComponent implements OnInit, OnDestroy {
    selectEmployee: Array<Employee>;
    subscription: Subscription;
    columns: Array<TableColumn> = [
        { prop: "EmpCode", name: "Code", flexGrow: 1 },
        { prop: "NameThai", name: "Name", flexGrow: 1 },
        { prop: "GroupName", name: "Group", flexGrow: 1 },
    ];

    get CanSelected():boolean {

        if (this.selectEmployee) {
            if (this.selectEmployee.length > 0) {
                return true;
            }
        }
        return false;
    }

    get Show2ndTable(): boolean {
        if (this.mode) {
            return false;
        }
        return true;
    }

    /** employee-dialog ctor */
    constructor(
        private service: EmployeeService,
        private serviceComDTable: DataTableServiceCommunicate<Employee>,
        public dialogRef: MatDialogRef<EmployeeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public mode: string
    ) { }

    /** Called by Angular after employee-dialog component initialized */
    ngOnInit(): void {
        if (!this.selectEmployee) {
            this.selectEmployee = new Array;
        }

        this.subscription = this.serviceComDTable.ToParent$
            .subscribe((scroll: Scroll) => this.loadData(scroll));
    }

    // angular hook
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // on get data with lazy load
    loadData(scroll: Scroll): void {
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceComDTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // selected Employee
    onSelectedEmp(employee?: Employee):void {
        if (employee) {
            // debug here
            // console.log("Selected employee", this.selectEmployee);
            // console.log("Employee", employee);
            if (!this.mode) {
                if (!this.selectEmployee) {
                    this.selectEmployee = new Array;
                }

                if (this.selectEmployee.length === 0) {
                    this.selectEmployee.push(Object.assign({}, employee));
                } else {
                    if (!this.selectEmployee.find(item => item.EmpCode === employee.EmpCode)) {
                        // cloning an object
                        this.selectEmployee.push(Object.assign({}, employee));
                    }
                }
            } else {
                this.selectEmployee = new Array;
                this.selectEmployee.push(Object.assign({}, employee));
                // send to master
                this.onSelectedClick();
            }
        }
    }

    // remove Employee Select
    onRemoveEmp(employee?: Employee):void {
        if (employee) {
            let index: number = this.selectEmployee.indexOf(employee);
            if (index > -1) {
                // remove item
                this.selectEmployee.splice(index, 1);
                this.selectEmployee = [...this.selectEmployee];
            }
        }
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selectEmployee);
    }
}