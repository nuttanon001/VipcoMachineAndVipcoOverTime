import { Component, ViewContainerRef, PipeTransform } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// components
import { BaseMasterComponent } from "../base-component/base-master.component";
// models
import { JobCardMaster, Page, PageData, Scroll, ScrollData } from "../../models/model.index";
// services
import {
    DialogsService, JobCardMasterService, JobCardDetailService,
    DataTableServiceCommunicate, JobCardMasterServiceCommunicate
} from "../../services/service.index";
import { AuthService } from "../../services/auth/auth.service";
// rxjs
import "rxjs/add/operator/switchMap";
// timezone
import * as moment from "moment-timezone";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "jobcard-master",
    templateUrl: "./jobcard-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [DataTableServiceCommunicate]
})

export class JobCardMasterComponent
    extends BaseMasterComponent<JobCardMaster, JobCardMasterService> {
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    onlyUser: boolean;
    // parameter
    columns = [
        { prop: "JobCardMasterNo", name: "No.", flexGrow: 1 },
        { prop: "ProjectDetailString", name: "Job Level2/3", flexGrow: 1 },
        { prop: "EmployeeRequireString", name: "Require", flexGrow: 1 },
        { prop: "JobCardDate", name: "Date", pipe: this.datePipe, flexGrow: 1 }
    ];

    // holla! {{"column.name" | translate }}

    // property
    get StatusJobCardMaster(): boolean {
        if (this.displayValue) {
            return this.displayValue.JobCardMasterStatus === 3;
        }
        return true;
    }

    constructor(
        service: JobCardMasterService,
        serviceCom: JobCardMasterServiceCommunicate,
        dataTableServiceCom: DataTableServiceCommunicate<JobCardMaster>,
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

    // on inti override
    ngOnInit(): void {
        this.onlyUser = true;
        // debug here
        // console.log("Task-Machine ngOnInit");

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
                                dbData.MachineUser = true;
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
        this.scroll = scroll;

        this.service.getAllWithScroll(scroll)
            .subscribe((scrollData: ScrollData<JobCardMaster>) => {
                if (scrollData) {
                    this.dataTableServiceCom.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on change time zone befor update to webapi
    changeTimezone(value: JobCardMaster): JobCardMaster {
        let zone: string = "Asia/Bangkok";
        if (value !== null) {
            if (value.CreateDate !== null) {
                value.CreateDate = moment.tz(value.CreateDate, zone).toDate();
            }
            if (value.ModifyDate !== null) {
                value.ModifyDate = moment.tz(value.ModifyDate, zone).toDate();
            }
            if (value.DueDate !== null) {
                value.DueDate = moment.tz(value.DueDate, zone).toDate();
            }
            if (value.JobCardDate !== null) {
                value.JobCardDate = moment.tz(value.JobCardDate, zone).toDate();
            }
        }
        return value;
    }

    // on detail edit override
    onDetailEdit(value?: JobCardMaster): void {
        if (value) {
            if (value.JobCardMasterStatus !== 1 && value.JobCardMasterStatus !== 4) {
                this.dialogsService.error("Access Denied", "Status war not waited. you can't edit it.", this.viewContainerRef);
                return;
            }

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

    // on insert data
    onInsertToDataBase(value: JobCardMaster): void {
        if (this.serverAuth.getAuth) {
            value.Creator = this.serverAuth.getAuth.UserName || "";
        } else {
            this.dialogsService.error("Error Message", "บัญชีผู้ใช้งาน ขาดการติดต่อกับระบบ โปรดล็อคอินใหม่ !!!", this.viewContainerRef);
            return;
        }
        let attachs: FileList | undefined = value.AttachFile;
        // change timezone
        value = this.changeTimezone(value);
        // insert data
        this.service.post(value).subscribe(
            (complete: any) => {
                if (complete && attachs) {
                    this.onAttactFileToDataBase(complete.JobCardMasterId, attachs);
                }
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
    onUpdateToDataBase(value: JobCardMaster): void {
        if (this.serverAuth.getAuth) {
            value.Modifyer = this.serverAuth.getAuth.UserName || "";
        }
        let attachs: FileList | undefined = value.AttachFile;

        // remove attach
        if (value.RemoveAttach) {

            this.onRemoveFileFromDataBase(value.RemoveAttach);
        }
        // change timezone
        value = this.changeTimezone(value);

        // debug here
        //console.log("value", JSON.stringify(value));
        // update data
        this.service.putKeyNumber(value, value.JobCardMasterId).subscribe(
            (complete: any) => {
                if (complete && attachs) {
                    this.onAttactFileToDataBase(complete.JobCardMasterId, attachs);
                }

                // debug here
                //console.log("putKeyNumber complate.");

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
    onDetailView(value: JobCardMaster): void {
        if (this.ShowEdit) {
            return;
        }

        if (value) {
            this.service.getOneKeyNumber(value.JobCardMasterId)
                .subscribe(dbData => {
                    this.displayValue = dbData;
                }, error => this.displayValue = undefined);
        } else {
            this.displayValue = undefined;
        }
    }

    // on attact file
    onAttactFileToDataBase(JobCardMasterId: number, Attacts: FileList): void {
        this.service.postAttactFile(JobCardMasterId, Attacts)
            .subscribe(complate => console.log("Upload Complate"), error => console.error(error));
    }

    // on remove file
    onRemoveFileFromDataBase(Attachs: Array<number>): void {
        Attachs.forEach((value: number) => {
            this.service.deleteAttactFile(value)
                .subscribe(complate => console.log("Delete Complate"), error => console.error(error));
        });
    }
}