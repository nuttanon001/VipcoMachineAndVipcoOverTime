// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { CuttingPlan,ProjectCodeDetail } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { DialogsService } from "../../services/dialog/dialogs.service";
import { CuttingPlanService, CuttingPlanServiceCommunicate } from "../../services/cutting-plan/cutting-plan.service";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";
// primeng
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "cutting-edit",
    templateUrl: "./cutting-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** cutting-edit component*/
export class CuttingEditComponent
    extends BaseEditComponent<CuttingPlan, CuttingPlanService>
{
    cuttingTypes: Array<SelectItem>;

    /** cutting-edit ctor */
    constructor(
        service: CuttingPlanService,
        serviceCom: CuttingPlanServiceCommunicate,
        private serviceProjectDetail: ProjectCodeDetailEditService,
        private viewContainerRef: ViewContainerRef,
        private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: CuttingPlan): void {
        if (value) {
            this.service.getOneKeyNumber(value.CuttingPlanId)
                .subscribe(dbData => {
                    this.editValue = dbData;

                    if (this.editValue.ProjectCodeDetailId) {
                        this.serviceProjectDetail.getOneKeyNumber(this.editValue.ProjectCodeDetailId)
                            .subscribe(dbProjectDetail => {
                                this.editValue.ProjectCodeString = dbProjectDetail.FullProjectLevelString;
                                this.editValueForm.patchValue({
                                    ProjectCodeString: this.editValue.ProjectCodeString,
                                });
                            });
                    }

                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                CuttingPlanId: 0
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();

        // CuttingType ComboBox
        if (!this.cuttingTypes) {
            this.cuttingTypes = new Array;
            this.cuttingTypes.push({ label: "CuttingPlan", value: 1 });
            this.cuttingTypes.push({ label: "ShopDrawing", value: 2 });
            this.cuttingTypes.push({ label: "Drawing", value: 3 });
        }

    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            CuttingPlanId: [this.editValue.CuttingPlanId],
            CuttingPlanNo: [this.editValue.CuttingPlanNo,
                [
                    Validators.required,
                    Validators.maxLength(250),
                ]
            ],
            Description: [this.editValue.Description,
                [
                    Validators.maxLength(200),
                ]
            ],
            ProjectCodeDetailId: [this.editValue.ProjectCodeDetailId],
            TypeCuttingPlan: [this.editValue.TypeCuttingPlan],
            Quantity: [this.editValue.Quantity],
            MaterialSize: [this.editValue.MaterialSize],
            MaterialGrade: [this.editValue.MaterialGrade],
            //
            Creator: [this.editValue.Creator],
            CreateDate: [this.editValue.CreateDate],
            Modifyer: [this.editValue.Modifyer],
            ModifyDate: [this.editValue.ModifyDate],
            //
            ProjectCodeString: [this.editValue.ProjectCodeString,
                [
                    Validators.required,
                ]
            ],
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // new Project Detail
    onNewDetail() {
        this.serviceDialogs.dialogSelectedDetail(this.viewContainerRef)
            .subscribe(proDetail => {
                if (proDetail) {
                    // cloning an object
                    this.editValue.ProjectCodeDetailId = proDetail.ProjectCodeDetailId;
                    this.editValue.ProjectCodeString = proDetail.FullProjectLevelString;
                    // patch value to form
                    this.editValueForm.patchValue({
                        ProjectCodeDetailId:this.editValue.ProjectCodeDetailId,
                        ProjectCodeString: this.editValue.ProjectCodeString,
                    });
                }
            });
    }
}