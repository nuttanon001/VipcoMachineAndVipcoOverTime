// angular
import { Component, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { ProjectCodeMaster, ProjectCodeDetail } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import {
    ProjectCodeMasterService,
    ProjectCodeMasterServiceCommunicate
} from "../../services/projectcode-master/projectcode-master.service";
import {
    ProjectCodeDetailService
} from "../../services/projectcode-detail/projectcode-detail.service";


@Component({
    selector: "project-edit",
    templateUrl: "./project-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// project-edit component*/
export class ProjectEditComponent
    extends BaseEditComponent<ProjectCodeMaster, ProjectCodeMasterService> {
    // paramater
    // columns = [
    //    { prop: "ProjectCodeDetailCode", name: "Code", flexGrow: 1 },
    //    { prop: "Description", name: "Description", flexGrow: 3 },
    // ];

    // project-edit ctor */
    constructor(
        service: ProjectCodeMasterService,
        serviceCom: ProjectCodeMasterServiceCommunicate,
        private viewContainerRef: ViewContainerRef,
        private serviceDetail: ProjectCodeDetailService,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: ProjectCodeMaster): void {
        if (value) {
            this.service.getOneKeyNumber(value.ProjectCodeMasterId)
                .subscribe(dbData => {
                    this.editValue = dbData;
                    // set Date
                    if (this.editValue.StartDate) {
                        this.editValue.StartDate = this.editValue.StartDate != null ?
                            new Date(this.editValue.StartDate) : new Date();
                    }

                    if (this.editValue.EndDate) {
                        this.editValue.EndDate = this.editValue.EndDate != null ?
                            new Date(this.editValue.EndDate) : new Date();
                    }

                    if (this.editValue.ProjectCodeMasterId) {
                        this.serviceDetail.getByMasterId(this.editValue.ProjectCodeMasterId)
                            .subscribe(dbDetail => {
                                this.editValue.ProjectCodeDetails = dbDetail.slice();
                                this.editValueForm.patchValue({
                                    ProjectCodeDetails: this.editValue.ProjectCodeDetails.slice(),
                                });
                            });
                    }

                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                ProjectCodeMasterId: 0,
                StartDate : new Date
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            ProjectCodeMasterId: [this.editValue.ProjectCodeMasterId],
            ProjectCode: [this.editValue.ProjectCode,
                [
                    Validators.required,
                    Validators.maxLength(50),
                ]
            ],
            ProjectName: [this.editValue.ProjectName,
                [
                    Validators.maxLength(200),
                ]
            ],
            StartDate: [this.editValue.StartDate],
            EndDate: [this.editValue.EndDate],
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            ProjectCodeDetails: [this.editValue.ProjectCodeDetails]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));

    }

    // new Detail
    onNewDetail():void {
        let detail: ProjectCodeDetail = {
            ProjectCodeDetailId: 0
        };
        this.serviceDetail.dialogProjectDetail(detail, this.viewContainerRef)
            .subscribe(resultDetail => {
                if (resultDetail) {
                    if (this.editValue.ProjectCodeMasterId) {
                        resultDetail.ProjectCodeMasterId = this.editValue.ProjectCodeMasterId;
                    }

                    if (!this.editValue.ProjectCodeDetails) {
                        this.editValue.ProjectCodeDetails = new Array;
                    }

                    if (this.editValue.ProjectCodeDetails) {
                        if (!resultDetail.Description) {
                            resultDetail.Description = "-";
                        }

                        // cloning an object
                        this.editValue.ProjectCodeDetails.push(Object.assign({}, resultDetail));
                        this.editValueForm.patchValue({
                            ProjectCodeDetails: this.editValue.ProjectCodeDetails.slice(),
                        });
                    }
                }
            });
    }

    // edit Detail
    onEditDetail(detail: ProjectCodeDetail):void {
        // debug here
        // console.log("onEditDetail:",detail);

        if (detail && this.editValue.ProjectCodeDetails) {
            let index: number = this.editValue.ProjectCodeDetails.indexOf(detail);
            if (index > -1) {
                this.serviceDetail.dialogProjectDetail(detail, this.viewContainerRef)
                    .subscribe(resultDetail => {
                        if (resultDetail && this.editValue.ProjectCodeDetails) {
                            // remove item
                            this.editValue.ProjectCodeDetails.splice(index, 1);
                            // cloning an object
                            this.editValue.ProjectCodeDetails.push(Object.assign({}, resultDetail));
                            this.editValueForm.patchValue({
                                ProjectCodeDetails: this.editValue.ProjectCodeDetails.slice(),
                            });
                        }
                    });
            }
        }
    }

    // remove Detail
    onRemoveDetail(detail: ProjectCodeDetail):void {
        if (detail && this.editValue.ProjectCodeDetails) {
            if (detail.ProjectCodeDetailId > 0) {
                this.serviceDetail.getCanDeleteProjectDetail(detail.ProjectCodeDetailId)
                    .subscribe(dbResult => {
                        if (dbResult.CanDelete) {
                            this.onRemoveDetailMethod(detail);
                        } else {
                            this.serviceDialogs.error("Deny Action",
                                "ข้อมูลมีการอ้างอิงถึงระบบไม่สามารถให้การกระทำนี้มีผลต่อระบบได้.", this.viewContainerRef);
                        }
                    });
            } else {
                this.onRemoveDetailMethod(detail);
            }
        }
    }

    // remover Detail Method
    onRemoveDetailMethod(detail: ProjectCodeDetail): void {
        if (detail && this.editValue.ProjectCodeDetails) {
            let index: number = this.editValue.ProjectCodeDetails.indexOf(detail);
            if (index > -1) {
                // remove item
                this.editValue.ProjectCodeDetails.splice(index, 1);
                this.editValue.ProjectCodeDetails = [...this.editValue.ProjectCodeDetails];
                // cloning an object
                this.editValueForm.patchValue({
                    ProjectCodeDetails: this.editValue.ProjectCodeDetails.slice(),
                });
            }
        }
    }
}