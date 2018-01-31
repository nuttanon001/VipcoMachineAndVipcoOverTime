// angular
import { Component, Input, Output } from "@angular/core";
import { OnInit, ViewContainerRef, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// model
import { JobCardDetail } from "../../models/model.index";
// service
import { DialogsService } from "../../services/dialog/dialogs.service";
import { MaterialService } from "../../services/material/material.service";
// rxjs
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "jobcard-detail-edit",
    templateUrl: "./jobcard-detail-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
    providers: [MaterialService,]
})
// jobcard-detail-edit component
export class JobcardDetailEditComponent implements OnInit {
    editValueForm: FormGroup;
    @Output("ComplateOrCancel") ComplateOrCancel = new EventEmitter<any>();
    @Input("EditValueDetail") EditValueDetail: JobCardDetail;
    @Input("MachineTypeId") MachineTypeId: number | undefined;
    @Input("ProjectDetailId") ProjectDetailId: number | undefined;

    tempMaterials: Array<string>;
    materials: Array<string>;
    unitNos: Array<SelectItem>;
    /** jobcard-detail-edit ctor */
    constructor(
        private serviceMaterial: MaterialService,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) { }

    /** Called by Angular after jobcard-detail-edit component initialized */
    ngOnInit(): void {
        this.buildForm();

        if (!this.tempMaterials) {
            this.tempMaterials = new Array;
            this.serviceMaterial.getAutoComplate()
                .subscribe(dbMaterials => {
                    this.tempMaterials = dbMaterials;
                });
        }
        if (!this.materials) {
            this.materials = new Array;
        }

        if (!this.unitNos) {
            this.unitNos = new Array;
            this.unitNos.push({ label: "Selected Unit No.", value: undefined });
            for (let i: number = 1; i < 41; i++) {
                this.unitNos.push({ label: `UnitNo.${i.toString()}`, value: i });
            }
        }
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            JobCardDetailId: [this.EditValueDetail.JobCardDetailId],
            Material: [this.EditValueDetail.Material,
                [
                    Validators.maxLength(200),
                ]
            ],
            Quality: [this.EditValueDetail.Quality],
            UnitNo: [this.EditValueDetail.UnitNo],
            JobCardDetailStatus: [this.EditValueDetail.JobCardDetailStatus],
            Remark: [this.EditValueDetail.Remark,
                [
                    Validators.maxLength(200)
                ]
            ],
            Creator: [this.EditValueDetail.Creator],
            CreateDate: [this.EditValueDetail.CreateDate],
            Modifyer: [this.EditValueDetail.Modifyer],
            ModifyDate: [this.EditValueDetail.ModifyDate],
            // fK
            JobCardMasterId: [this.EditValueDetail.JobCardMasterId],
            UnitMeasureId: [this.EditValueDetail.UnitMeasureId],
            StandardTimeId: [this.EditValueDetail.StandardTimeId],
            CuttingPlanId: [this.EditValueDetail.CuttingPlanId],
            UnitsMeasure: [this.EditValueDetail.UnitsMeasure],
            CuttingPlan: [this.EditValueDetail.CuttingPlan],
            // viewModel
            UnitsMeasureString: [this.EditValueDetail.UnitsMeasureString],
            CuttingPlanString: [this.EditValueDetail.CuttingPlanString],
            StandardTimeString: [this.EditValueDetail.StandardTimeString],
            StatusString: [this.EditValueDetail.StatusString],
        });
    }

    // on New/Update
    onNewOrUpdateClick(): void {
        if (this.editValueForm) {
            let newOrUpdate: JobCardDetail = this.editValueForm.value;

            if (newOrUpdate.JobCardDetailStatus === 3) {
                newOrUpdate.JobCardDetailStatus = 1;
                newOrUpdate.StatusString = "Wait";
            }

            if (!newOrUpdate.Quality) {
                newOrUpdate.Quality = 1;
            } else if (newOrUpdate.Quality < 1) {
                newOrUpdate.Quality = 1;
            }

            if (newOrUpdate.UnitNo) {
                newOrUpdate.CuttingPlanString += " | Unit." + newOrUpdate.UnitNo;
            }

            if (newOrUpdate.UnitsMeasureString || newOrUpdate.CuttingPlanString ||
                newOrUpdate.Material || newOrUpdate.Quality || newOrUpdate.StandardTimeString) {
                this.ComplateOrCancel.emit(this.editValueForm.value);
            } else {
                this.serviceDialogs.error("Error Message", "ไม่พบข้อมูลโปรดตรวจสอบ", this.viewContainerRef);
            }
        }
    }

    // on Cancel
    onCancelClick(): void {
        this.ComplateOrCancel.emit(undefined);
    }

    // on CuttingPlan click
    onCuttingPlanClick(): void {
        this.serviceDialogs.dialogSelectCuttingPlan(this.viewContainerRef, this.ProjectDetailId)
            .subscribe(resultCutting => {
                if (resultCutting) {
                    this.editValueForm.patchValue({
                        CuttingPlanId: resultCutting.CuttingPlanId,
                        CuttingPlanString: resultCutting.CuttingPlanNo,
                        // don't use CuttingPlan: Object.assign({}, resultCutting),
                        CuttingPlan: Object.assign({}, resultCutting),
                        Material: resultCutting.MaterialSize ? (resultCutting.MaterialSize || "") + " " + (resultCutting.MaterialGrade || "") : "",
                        Quality: resultCutting.Quantity || 1,
                    });
                }
            });
    }

    // on StandardTime click
    onStandardTimeClick(): void {
        // console.log(this.MachineTypeId);
        this.serviceDialogs.dialogSelectStandardTime(this.viewContainerRef, this.MachineTypeId)
            .subscribe(resultStdTime => {
                if (resultStdTime) {
                    this.editValueForm.patchValue({
                        StandardTimeId: resultStdTime.StandardTimeId,
                        StandardTimeString: `${resultStdTime.GradeMaterialString} - ${resultStdTime.StandardTimeCode}`,
                    });
                }
            });
    }

    // on UnitsMeasure click
    onUnitsMeasureClick(): void {
        this.serviceDialogs.dialogSelectUom(this.viewContainerRef)
            .subscribe(resultUom => {
                if (resultUom) {
                    this.editValueForm.patchValue({
                        UnitMeasureId: resultUom.UnitMeasureId,
                        UnitsMeasureString: resultUom.UnitMeasureName,
                        UnitsMeasure: Object.assign({}, resultUom),
                        // don't use UnitsMeasure: Object.assign({}, resultUom),
                    });
                }
            });
    }

    // on search autocomplate
    onSearchAutoComplate(event:any):void {
        this.materials = new Array;

        for (let i:number = 0; i < this.tempMaterials.length; i++) {
            let material: string = this.tempMaterials[i];
            // console.log(event.query.toLowerCase(), material, material.toLowerCase().indexOf(event.query.trim().toLowerCase()));
            if (material.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.materials.push(material);
            }
        }
    }
}