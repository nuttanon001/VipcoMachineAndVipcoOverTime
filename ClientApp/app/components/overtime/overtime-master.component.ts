import { Component, ViewContainerRef, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { OverTimeMaster, Scroll, ScrollData, MessageDialog } from "../../models/model.index";
// services
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { DialogsService } from "../../services/dialog/dialogs.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
import { AuthService } from "../../services/auth/auth.service";
import {
    OverTimeMasterService,
    OverTimeMasterServiceCommunicate
} from "../../services/overtime-master/overtime-master.service";
// rxjs
import "rxjs/add/operator/switchMap";
// timezone
import * as moment from "moment-timezone";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "overtime-master",
    templateUrl: "./overtime-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})
// overtime-master component*/
export class OvertimeMasterComponent
    extends BaseMasterComponent<OverTimeMaster, OverTimeMasterService> {
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    OverTimeMasterId: number = 0;
    onlyUser: boolean;
    preViewOnly: boolean;
    loadReport: boolean = false;

    get DisableChange(): boolean {
        if (this.serverAuth.getAuth) {
            if (this.serverAuth.getAuth.LevelUser) {
                return this.serverAuth.getAuth.LevelUser < 3;
            }
        }
        return true;
    }

    columns = [
        { prop: "RequireString", name: "Require", flexGrow: 1 },
        { prop: "ProjectMasterString", name: "Job Number", flexGrow: 1 },
        { prop: "GroupMisString", name: "Group", flexGrow: 1, },
        { prop: "OverTimeDate", name: "Date", pipe: this.datePipe, flexGrow: 1 }
    ];

    // overtime-master ctor */
    constructor(
        service: OverTimeMasterService,
        serviceCom: OverTimeMasterServiceCommunicate,
        dataTableServiceCom: DataTableServiceCommunicate<OverTimeMaster>,
        dialogsService: DialogsService,
        viewContainerRef: ViewContainerRef,
        private router: Router,
        private route: ActivatedRoute,
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

    // called by Angular after overtime-master component initialized */

    // on inti override
    ngOnInit(): void {
        this.onlyUser = true;
        // override class
        super.ngOnInit();
        // this.route.paramMap.switchMap((params: ParamMap) => this.routeToEdit(0));

        this.route.paramMap
            .subscribe((params: ParamMap) => {
                // console.log("params : ", params);

                let key: number = Number(params.get("condition") || 0);
                if (key) {
                    this.service.getOneKeyNumber(key)
                        .subscribe(dbData => {
                            setTimeout(() => {
                                this.onDetailEdit(dbData);
                            }, 500);
                        }, error => this.displayValue = undefined);
                }
            }, error => console.error(error));
    }

    // on get data with lazy load
    loadPagedData(scroll: Scroll): void {
        if (this.onlyUser) {
            if (this.serverAuth.getAuth) {
                scroll.Where = this.serverAuth.getAuth.UserName || "";
            }
        } else {
            scroll.Where = "";
        }

        if (this.scroll) {
            if (this.scroll.Filter && scroll.Reload) {
                scroll.Filter = this.scroll.Filter;
            }
        }

        //debug here
        // console.log("LoadData", JSON.stringify(scroll));

        this.scroll = scroll;
        this.service.getAllWithScroll(scroll)
            .subscribe((scrollData: ScrollData<OverTimeMaster>) => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                    // this.useTemplate = false;
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: OverTimeMaster): OverTimeMaster {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.OverTimeDate !== null) {
                value.OverTimeDate = moment.tz(value.OverTimeDate, zone).toDate();
            }
        }
        return value;
    }

    // on detail edit override
    onDetailEdit(value?: OverTimeMaster): void {
        if (value) {
            // if (value.OverTimeStatus !== 1) {
            //    this.dialogsService.error("Access Denied", "Status war not waited. you can't edit it.", this.viewContainerRef);
            //    return;
            // }

            if (this.serverAuth.getAuth) {
                if (this.serverAuth.getAuth.LevelUser < 2) {
                    if (this.serverAuth.getAuth.UserName !== value.Creator) {
                        this.dialogsService.error("Access Denied", "You don't have permission to access.", this.viewContainerRef);
                        return;
                    }
                }
            }
        }
        super.onDetailEdit(value);
    }

    // on detail view
    onDetailView(value?: OverTimeMaster): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.OverTimeMasterId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }

    // on insert data
    onInsertToDataBase(value: OverTimeMaster): void {
        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        } else {
            this.dialogsService.error("Error Message", "บัญชีผู้ใช้งาน ขาดการติดต่อกับระบบ โปรดล็อคอินใหม่ !!!", this.viewContainerRef);
            return;
        }
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        // console.log("Value:", value);
        this.service.postV2(value).subscribe(
            (complete: any) => {
                if (complete.OverTimeMaster.OverTimeMasterId > 0) {
                    this.displayValue = complete.OverTimeMaster;
                    // this.useTemplate = true;
                    if (complete.isRemove) {
                        let message: MessageDialog = {
                            headerMessage: "ระบบตรวจพบพนักงานดังกล่าวนี้ มีข้อมูลในการทำล่วงเวลาใบอื่นๆ",
                            bodyMessage: complete.Remove
                        };
                        this.dialogsService.dialogMessage(this.viewContainerRef, message)
                            .subscribe(gg => this.onSaveComplete());
                    } else {
                        this.onSaveComplete();
                    }
                } else {
                    let message: MessageDialog = {
                        headerMessage: "ระบบตรวจพบพนักงานดังกล่าวนี้ มีข้อมูลในการทำล่วงเวลาใบอื่นๆ",
                        bodyMessage: complete.Remove
                    };
                    this.dialogsService.dialogMessage(this.viewContainerRef, message);
                }
            },
            (error: any) => {
                console.error(error);
                this.editValue.Creator = undefined;
                let message: any = error.replace("404 - Not Found", "");
                this.canSave = true;
                this.dialogsService.error("Failed !", `Save failed with the following error: ${message}!!!`,
                    this.viewContainerRef);
            }
        );
    }

    // on update data
    onUpdateToDataBase(value: OverTimeMaster): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        // change timezone
        value = this.changeTimezone(value);
        // update data
        this.service.putKeyNumber(value, value.OverTimeMasterId).subscribe(
            (complete: any) => {
                this.displayValue = complete.OverTimeMaster;
                // this.useTemplate = true;
                if (complete.isRemove) {
                    let message: MessageDialog = {
                        headerMessage: "ระบบตรวจพบพนักงานดังกล่าวนี้ มีข้อมูลในการทำล่วงเวลาใบอื่นๆ",
                        bodyMessage: complete.Remove
                    };
                    this.dialogsService.dialogMessage(this.viewContainerRef, message)
                        .subscribe(gg => this.onSaveComplete());
                } else {
                    // this.useTemplate = true;
                    this.onSaveComplete();
                }
            },
            (error: any) => {
                console.error(error);
                let message: any = error.replace("404 - Not Found", "");
                this.canSave = true;
                this.dialogsService.error("Failed !", `Save failed with the following error: ${message}!!!`,
                    this.viewContainerRef);
            }
        );
    }

    // on change status
    onChangeStatus(value?: OverTimeMaster): void {
        if (value) {
            if (this.serverAuth.getAuth) {
                // console.log(this.serverAuth.getAuth);
                if (this.serverAuth.getAuth.LevelUser > 2) {
                    // console.log(value);
                    this.service.getChangeStatus(value.OverTimeMasterId).subscribe(
                        (complete: any) => {
                            this.displayValue = complete.OverTimeMaster;
                            this.onSaveComplete();
                        },
                        (error: any) => {
                            console.error(error);
                            let message: any = error.replace("404 - Not Found", "");
                            this.canSave = true;
                            this.dialogsService.error("Failed !", `Save failed with the following error: ${message}!!!`,
                                this.viewContainerRef);
                        }
                    );
                }
            }
        }
    }

    // on save complete override
    onSaveComplete(): void {
        this.dialogsService
            .context("System message", "Save completed and Required-OverTime perview.", this.viewContainerRef)
            .subscribe(result => {
                this.canSave = false;
                this.ShowEdit = false;
                this.editValue = undefined;
                let overtime: OverTimeMaster | undefined = this.displayValue;
                this.onDetailView(undefined);
                // report preview
                if (overtime) {
                    if (overtime.OverTimeStatus === 1) {
                        this.reporPdf(overtime);
                    }
                }
                setTimeout(() => {
                    this.dataTableServiceCom.toReload(true);
                }, 150);
            });
    }

    // reportPdf
    reporPdf(value?: OverTimeMaster): void {
        if (value) {
            this.OverTimeMasterId = value.OverTimeMasterId;
            if (value.OverTimeStatus) {
                if (value.OverTimeStatus === 2 || value.OverTimeStatus === 3) {
                    this.preViewOnly = false;
                    this.loadReport = !this.loadReport;
                } else {
                    this.preViewOnly = true;
                    this.loadReport = !this.loadReport;
                }
            } else {
                this.preViewOnly = true;
                this.loadReport = !this.loadReport;
            }
        }

        // this.dialogsService.error("Error Message",
        //    "Only overtime has been approverd could print.",
        //    this.viewContainerRef);
    }
}