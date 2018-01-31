import { Component, ViewContainerRef } from "@angular/core";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { ProjectCodeMaster, Page, PageData, Scroll } from "../../models/model.index";
// services
import {
    DialogsService,
    DataTableServiceCommunicate,
} from "../../services/service.index";
import { AuthService } from "../../services/auth/auth.service";
import {
    ProjectCodeMasterService,
    ProjectCodeMasterServiceCommunicate
} from "../../services/projectcode-master/projectcode-master.service";

// timezone
import * as moment from "moment-timezone";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";
import { ProjectCodeDetailService } from "../../services/projectcode-detail/projectcode-detail.service";

@Component({
    selector: "project-master",
    templateUrl: "./project-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate, ProjectCodeDetailService]
})
// project-master component*/
export class ProjectMasterComponent
    extends BaseMasterComponent<ProjectCodeMaster, ProjectCodeMasterService> {
    // parameter
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    columns = [
        { prop: "ProjectCode", name: "Code", flexGrow: 1 },
        { prop: "ProjectName", name: "Name", flexGrow: 1 },
        { prop: "StartDate", name: "Date", pipe: this.datePipe, flexGrow: 1 },
    ];

    // project-master ctor */
    constructor(
        service: ProjectCodeMasterService,
        serviceCom: ProjectCodeMasterServiceCommunicate,
        dataTableServiceCom: DataTableServiceCommunicate<ProjectCodeMaster>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
        private serverAuth: AuthService,
    ) {
        super(
            service,
            serviceCom,
            dataTableServiceCom,
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
        // console.log("Scroll:", JSON.stringify(scroll));
        this.scroll = scroll;
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: ProjectCodeMaster): ProjectCodeMaster {
        var zone:string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.StartDate !== null) {
                value.StartDate = moment.tz(value.StartDate, zone).toDate();
            }
            if (value.EndDate !== null) {
                value.EndDate = moment.tz(value.EndDate, zone).toDate();
            }

            if (value.ProjectCodeDetails) {
                value.ProjectCodeDetails.forEach((detail, index) => {
                    if (detail.CreateDate) {
                        detail.CreateDate = moment.tz(detail.CreateDate, zone).toDate();
                    }
                    if (detail.ModifyDate) {
                        detail.ModifyDate = moment.tz(detail.ModifyDate, zone).toDate();
                    }

                    if (value.ProjectCodeDetails) {
                        value.ProjectCodeDetails[index] = detail;
                    }
                });
            }
        }
        return value;
    }

    // on insert data
    onInsertToDataBase(value: ProjectCodeMaster): void {
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
    onUpdateToDataBase(value: ProjectCodeMaster): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.ProjectCodeMasterId).subscribe(
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
    onDetailView(value: ProjectCodeMaster): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.ProjectCodeMasterId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }
}