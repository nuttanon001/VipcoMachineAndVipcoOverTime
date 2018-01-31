import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
// import { Employee, Scroll } from "../../models/model.index";
import { Employee } from "../../../models/employee/employee.model";
import { Scroll } from "../../../models/page/page.model";
// service
import { EmployeeService } from "../../../services/employee/employee.service";
import { EmployeeGroupService } from "../../../services/employee-group/employee-group.service";
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
    selector: "employee-by-group-dialog",
    templateUrl: "./employee-by-group-dialog.component.html",
    styleUrls: [
        "../../../styles/master.style.scss",
        "../../../styles/edit.style.scss"
    ],
    providers: [
        EmployeeService,
        EmployeeGroupService,
        DataTableServiceCommunicate
    ]
})
// employee-by-group-dialog component*/
export class EmployeeByGroupDialogComponent
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
    // employee-by-group-dialog ctor */
    constructor(
        public service: EmployeeService,
        private serviceGroup: EmployeeGroupService,
        public serviceDataTable: DataTableServiceCommunicate<Employee>,
        public dialogRef: MatDialogRef<EmployeeByGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public groupCode: string
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );

        this.columns = [
            { prop: "EmpCode", name: "Code", flexGrow: 1 },
            { prop: "NameThai", name: "Name", flexGrow: 1 },
            { prop: "GroupName", name: "Group", flexGrow: 1 },
        ];
    }

    // on init
    onInit(): void {
        this.fastSelectd = false;

        if (!this.employees) {
            this.employees = new Array;
        }

        this.serviceGroup.getAll()
            .subscribe(dbGroupEmployee => {
                this.groups = new Array;
                this.groups.push({ label: "ทุกกลุ่มงาน", value: "" });
                for (let item of dbGroupEmployee) {
                    this.groups.push({ label: `${(item.Description || "")}`, value: item.GroupCode });
                }
            }, error => console.error(error));
    }

    // on get data with lazy load
    loadDataScroll(scroll: Scroll): void {
        scroll.Where = this.groupCode.toString();
        // console.log("Scroll Data:", JSON.stringify(scroll));
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    if (scrollData.Scroll) {
                        this.template = scrollData.Scroll;
                        // console.log("After:",JSON.stringify(scrollData.Scroll));
                    }
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
        if (this.groupCode) {
            this.service.getByMasterCode(this.groupCode)
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
            this.groupCode = event.value;

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