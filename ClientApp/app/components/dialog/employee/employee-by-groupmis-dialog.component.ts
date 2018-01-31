import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
// import { Employee, Scroll } from "../../models/model.index";
import { Employee } from "../../../models/employee/employee.model";
import { Scroll } from "../../../models/page/page.model";
// service
import { EmployeeService } from "../../../services/employee/employee.service";
import { EmployeeGroupMisService } from "../../../services/employee-group/employee-group-mis.service";
import { DataTableServiceCommunicate } from "../../../services/data-table/data-table.service";
// base component
import { BaseDialogComponent } from "../../base-component/base-dialog.component";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "employee-by-groupmis-dialog",
    templateUrl: "./employee-by-groupmis-dialog.component.html",
    styleUrls: [
        "../../../styles/master.style.scss",
        "../../../styles/edit.style.scss"
    ],
    providers: [
        EmployeeService,
        EmployeeGroupMisService,
        DataTableServiceCommunicate
    ]
})
// employee-by-group-mis-dialog component*/
export class EmployeeByGroupMisDialogComponent
    extends BaseDialogComponent<Employee, EmployeeService> implements OnDestroy {
    employees: Array<Employee>;
    groups: Array<SelectItem>;
    template: Scroll;
    get CanSelected(): boolean {
        if (this.employees) {
            if (this.employees.length > 0) {
                return true;
            }
        }
        return false;
    }
    // employee-by-group-mis-dialog ctor */
    constructor(
        public service: EmployeeService,
        private serviceGroupMis: EmployeeGroupMisService,
        public serviceDataTable: DataTableServiceCommunicate<Employee>,
        public dialogRef: MatDialogRef<EmployeeByGroupMisDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public groupMisCode: string
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );

        this.columns = [
            { prop: "EmpCode", name: "CodeMis", flexGrow: 1 },
            { prop: "NameThai", name: "NameMis", flexGrow: 1 },
            { prop: "GroupName", name: "GroupMis", flexGrow: 1 },
        ];
    }

    // on init
    onInit(): void {
        this.fastSelectd = false;

        if (!this.employees) {
            this.employees = new Array;
        }

        this.serviceGroupMis.getAll()
            .subscribe(dbGroupMis => {
                this.groups = new Array;
                this.groups.push({ label: "ทุกกลุ่มงาน", value: "" });
                for (let item of dbGroupMis) {
                    this.groups.push({ label: `${(item.GroupDesc || "")}`, value: item.GroupMIS });
                }
            }, error => console.error(error));
    }

    // on get data with lazy load
    loadDataScroll(scroll: Scroll): void {
        scroll.Where = this.groupMisCode.toString();
        // console.log("Scroll Data:", JSON.stringify(scroll));
        this.service.getAllWithScroll(scroll,"GetScrollMis")
            .subscribe(scrollData => {
                if (scrollData) {
                    if (scrollData.Scroll) {
                        this.template = scrollData.Scroll;
                        // after
                        // console.log("After:",JSON.stringify(scrollData));
                    }

                    // after
                    // console.log("After:",JSON.stringify(scrollData));

                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on destory
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // on select employee by group
    onSelectByGroup(): void {
        if (this.groupMisCode) {
            this.service.getByMasterCode(this.groupMisCode)
                .subscribe(dbEmployee => {
                    if (dbEmployee) {
                        this.employees.push(...dbEmployee);
                        this.onSelectedClick();
                    }
                });
        }
    }

    // on selected employee
    onSelectedClick(): void {
        if (this.employees) {
            this.dialogRef.close(this.employees);
        }
    }

    // on dropdown selected change
    onDropDownSelectedChange(event?: any): void {
        if (event) {

            this.template.Reload = true;
            this.template.Skip = 0;
            this.template.Take = 8;
            this.template.Where = event.value;
            this.groupMisCode = event.value;

            // debug here
            // console.log("event :", JSON.stringify(this.template));
            this.loadDataScroll(this.template);

            // this.typeMachine = selected.selected[0];
            // this.serviceMachine.getByMasterId(this.typeMachine.TypeMachineId)
            //    .subscribe(dbMachine => {
            //        this.machines = dbMachine.slice();
            //    });
        }
    }

    // selected Value override
    onSelectedValue(value?: Employee): void {
        if (value) {
            if (!this.employees) {
                this.employees = new Array;
            }

            if (this.employees.length === 0) {
                this.employees.push(Object.assign({}, value));
            } else {
                if (!this.employees.find(item => item.EmpCode === value.EmpCode)) {
                    // cloning an object
                    this.employees.push(Object.assign({}, value));
                }
            }
        }
    }

    // remove Employee Select
    onRemoveEmp(employee?: Employee): void {
        if (employee) {
            let index: number = this.employees.indexOf(employee);
            if (index > -1) {
                // remove item
                this.employees.splice(index, 1);
                this.employees = [...this.employees];
            }
        }
    }
}