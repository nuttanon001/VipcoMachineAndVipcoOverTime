import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import {
    Machine, TypeMachine,
    Scroll
} from "../../models/model.index";
// service
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { MachineService } from "../../services/machine/machine.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { DatatableComponent, TableColumn } from "@swimlane/ngx-datatable";
import { SelectItem } from "primeng/primeng";

@Component({
    selector: 'machine-dialog',
    templateUrl: './machine-dialog.component.html',
    styleUrls: ["../../styles/master.style.scss", "../../styles/edit.style.scss"],
    providers: [
        MachineService,
        TypeMachineService,
    ]
})
/** machine-dialog component*/
export class MachineDialogComponent
    implements OnInit
{
    machines: Array<Machine>;
    templates: Array<Machine>;
    typeMachines: Array<SelectItem>;
    typeMachine: TypeMachine;
    // Machine
    selectedMachine: Machine | undefined;
    // Column
    columns: Array<TableColumn> = [
        { prop: "MachineCode", name: "Code", flexGrow: 1 },
        { prop: "MachineName", name: "Name", flexGrow: 1 }
    ];
    // table
    @ViewChild(DatatableComponent) table: DatatableComponent;
    // proprty
    get CanSelected(): boolean {
        return this.selectedMachine !== undefined;
    }

    /** machine-dialog ctor */
    constructor(
        private serviceMachine: MachineService,
        private serviceTypeMachine: TypeMachineService,
        public dialogRef: MatDialogRef<MachineDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public mode: number
    ) { }

    /** Called by Angular after machine-dialog component initialized */
    ngOnInit(): void {
        if (!this.typeMachines) {
            this.typeMachines = new Array;
        }

        if (!this.machines) {
            this.machines = new Array;
        }

        this.serviceTypeMachine.getAll()
            .subscribe(dbTypeMachines => {
                if (this.mode) {
                    dbTypeMachines = dbTypeMachines.filter(item => item.TypeMachineId == this.mode).slice();
                    this.serviceMachine.getByMasterId(this.mode)
                        .subscribe(dbMachine => {
                            this.machines = dbMachine.slice();
                            this.templates = dbMachine.slice();
                        });
                } else {
                    dbTypeMachines = dbTypeMachines.slice();
                }

                this.typeMachines = new Array;
                for (let item of dbTypeMachines) {
                    this.typeMachines.push({ label: `${(item.TypeMachineCode || "")} ${(item.Name || "")}`, value: item.TypeMachineId });
                }
            }, error => console.error(error));
    }

    // Selected Machine
    onSelectedMachine(selected?: any): void {
        if (selected) {
            this.selectedMachine = selected.selected[0];
            this.onSelectedClick();
        }
    }

    // Selected Type Machine
    onSelectedTypeMachine(selected?: any): void {
        if (selected) {
            // debug here
            // console.log("selected :", selected);
            //this.typeMachine = selected.selected[0];
            //this.serviceMachine.getByMasterId(this.typeMachine.TypeMachineId)
            //    .subscribe(dbMachine => {
            //        this.machines = dbMachine.slice();
            //    });
        }
    }

    // on Filter
    onFilter(search: string) {
        // filter our data
        const temp = this.templates.slice().filter((item, index) => {
            let searchStr = ((item.MachineName || "") + (item.MachineCode || "") + (item.TypeMachineString || "")).toLowerCase();
            // debug here
            // console.log(searchStr);
            // console.log(searchStr.indexOf(search.toLowerCase()));

            return searchStr.indexOf(search.toLowerCase()) != -1;
        });

        // update the rows
        this.machines = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selectedMachine);
    }
}