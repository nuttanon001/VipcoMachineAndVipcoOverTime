import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { HolidayOverTime, Scroll, ScrollData } from "../../models/model.index";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { HolidayOverTimeService , HolidayOverTimeServiceCommunicate } from "../../services/overtime-master/holiday-overtime.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";
// 3rd Party
import { TableColumn } from "@swimlane/ngx-datatable";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "holiday-master",
    templateUrl: "./holiday-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [ DataTableServiceCommunicate ]
})
// holiday-master component*/
export class HolidayMasterComponent 
    extends BaseMasterComponent<HolidayOverTime, HolidayOverTimeService> {
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");

    columns: Array<TableColumn> = [
        { prop: "HolidayName", name: "Name", flexGrow: 1 },
        { prop: "HolidayDate", name: "Date", flexGrow: 1, pipe: this.datePipe,},
    ];
    /** holiday-master ctor */
    constructor(
        service: HolidayOverTimeService,
        serviceCom: HolidayOverTimeServiceCommunicate,
        serviceComDataTable: DataTableServiceCommunicate<HolidayOverTime>,
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
    changeTimezone(value: HolidayOverTime): HolidayOverTime {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.HolidayDate !== null) {
                value.HolidayDate = moment.tz(value.HolidayDate, zone).toDate();
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: HolidayOverTime): void {
        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // console.log(value);
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
    onUpdateToDataBase(value: HolidayOverTime): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.HolidayId).subscribe(
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
    onDetailView(value: HolidayOverTime): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.HolidayId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}