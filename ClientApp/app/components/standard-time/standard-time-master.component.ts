import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { TypeStandardTime, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { TypeStandardTimeService, TypeStandardTimeServiceCommunicate } from "../../services/type-standard-time/type-standard-time.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "standard-time-master",
    templateUrl: "./standard-time-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
// standard-time-master component*/
export class StandardTimeMasterComponent
    extends BaseMasterComponent<TypeStandardTime, TypeStandardTimeService> {
    columns:Array<TableColumn> = [
        { prop: "TypeMachineString", name: "Name", flexGrow: 2 },
        { prop: "Name", name: "Code", flexGrow: 1 },
    ];

    /** standard-time-master ctor */
    constructor(
        service: TypeStandardTimeService,
        serviceCom: TypeStandardTimeServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<TypeStandardTime>,
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
    changeTimezone(value: TypeStandardTime): TypeStandardTime {
        let zone:string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }

            if (value.StandardTimes) {
                value.StandardTimes.forEach((Standard, index) => {
                    if (Standard.CreateDate) {
                        Standard.CreateDate = moment.tz(Standard.CreateDate, zone).toDate();
                    }
                    if (Standard.ModifyDate) {
                        Standard.ModifyDate = moment.tz(Standard.ModifyDate, zone).toDate();
                    }

                    if (value.StandardTimes) {
                        value.StandardTimes[index] = Standard;
                    }
                });
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: TypeStandardTime): void {
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
                this.dialogsService.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!",
                    this.viewContainerRef);
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: TypeStandardTime): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.TypeStandardTimeId).subscribe(
            (complete: any) => {
                this.displayValue = complete;
                this.onSaveComplete();
            },
            (error: any) => {
                console.error(error);
                this.canSave = true;
                this.dialogsService.error("Failed !", "Save failed with the following error: Invalid Identifier code !!!",
                    this.viewContainerRef);
            }
        );
    }

    // on detail view
    onDetailView(value: TypeStandardTime): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.TypeStandardTimeId)
                .subscribe(dbData => {
                    // debug here
                    // console.log("Data is :", dbData);

                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}