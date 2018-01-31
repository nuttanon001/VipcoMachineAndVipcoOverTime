import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { Machine,Scroll,ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { MachineService , MachineServiceCommunicate } from "../../services/machine/machine.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "machine-master",
    templateUrl: "./machine-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
// machine-master component*/
export class MachineMasterComponent
    extends BaseMasterComponent<Machine, MachineService> {
    columns:Array<TableColumn> = [
        { prop: "MachineCode", name: "Code", flexGrow: 1 },
        { prop: "MachineName", name: "Name", flexGrow: 2 },
        { prop: "TypeMachineString", name: "Group", flexGrow : 1},
    ];

    /** machine-master ctor */
    constructor(
        service: MachineService,
        serviceCom: MachineServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<Machine>,
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

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        if (this.scroll) {
            if (this.scroll.Filter && scroll.Reload) {
                scroll.Filter = this.scroll.Filter;
            }
        }

        this.scroll = scroll;
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: Machine): Machine {
        let zone:string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.InstalledDate !== null) {
                value.InstalledDate = moment.tz(value.InstalledDate, zone).toDate();
            }

            if (value.MachineHasOperators) {
                value.MachineHasOperators.forEach((Operator, index) => {
                    if (Operator.CreateDate) {
                        Operator.CreateDate = moment.tz(Operator.CreateDate, zone).toDate();
                    }
                    if (Operator.ModifyDate) {
                        Operator.ModifyDate = moment.tz(Operator.ModifyDate, zone).toDate();
                    }

                    if (value.MachineHasOperators) {
                        value.MachineHasOperators[index] = Operator;
                    }
                });
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: Machine): void {
        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        }
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
    onUpdateToDataBase(value: Machine): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.MachineId).subscribe(
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
    onDetailView(value: Machine): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.MachineId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}