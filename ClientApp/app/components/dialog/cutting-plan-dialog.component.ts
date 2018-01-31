import { Component, ViewContainerRef, Inject, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { CuttingPlan, Scroll } from "../../models/model.index";
// service
import { CuttingPlanService } from "../../services/cutting-plan/cutting-plan.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { ProjectCodeDetailEditService } from "../../services/projectcode-detail/projectcode-detail-edit.service";
import { DialogsService } from "../../services/dialog/dialogs.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// base-component
import { BaseDialogComponent } from "../base-component/base-dialog.component";
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "cutting-plan-dialog",
    templateUrl: "./cutting-plan-dialog.component.html",
    styleUrls: [
        "../../styles/master.style.scss",
        "../../styles/edit.style.scss"
    ],
    providers: [
        CuttingPlanService,
        ProjectCodeDetailEditService,
        DataTableServiceCommunicate
    ]
})
/** cutting-plan-dialog component*/
export class CuttingPlanDialogComponent
    extends BaseDialogComponent<CuttingPlan, CuttingPlanService> implements OnDestroy
{
    showNewModel: boolean = true;
    CanSaveAndSelected: boolean = false;
    // ComboBox
    cuttingTypes: Array<SelectItem>;
    projectDetails: Array<SelectItem>;
    // FormGroup
    editValueForm: FormGroup;
    /** cutting-plan-dialog ctor */
    constructor(
        public service: CuttingPlanService,
        public serviceDataTable: DataTableServiceCommunicate<CuttingPlan>,
        public dialogRef: MatDialogRef<CuttingPlanDialogComponent>,
        private serviceProDetail: ProjectCodeDetailEditService,
        @Inject(MAT_DIALOG_DATA) public mode: number,
        // private viewContainerRef: ViewContainerRef,
        // private serviceDialogs: DialogsService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );
    }

    // on init
    onInit(): void {
        this.columns = [
            { prop: "CuttingPlanNo", name: "No.", flexGrow: 2 },
            { prop: "ProjectCodeString", name: "JobLevel2/3", flexGrow: 1 },
            { prop: "MaterialSize", name: "Material", flexGrow: 1 },
            { prop: "Quantity", name: "Quantity", flexGrow: 1 },
        ];

        this.fastSelectd = true;
    }

    // on get data with lazy load
    loadDataScroll(scroll: Scroll): void {
        if (this.mode) {
            scroll.Where = this.mode.toString();
        }

        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on destory
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    //on new model
    onNewModel(): void {
        this.showNewModel = !this.showNewModel;
        let newModel: CuttingPlan = {
            CuttingPlanId: 0,
            TypeCuttingPlan: 1,
        };
        //Clear Selected
        this.selected = undefined;
        // build form
        this.buildForm(newModel);
        // CuttingType ComboBox
        if (!this.cuttingTypes) {
            this.cuttingTypes = new Array;
            this.cuttingTypes.push({ label: "CuttingPlan", value: 1 });
            this.cuttingTypes.push({ label: "ShopDrawing", value: 2 });
            this.cuttingTypes.push({ label: "Drawing", value: 3 });
        }
        // ProjectDetail ComboBox
        if (!this.projectDetails) {
            if (this.mode) {
                this.serviceProDetail.getOneKeyNumber(this.mode)
                    .subscribe(dbDetail => {
                        this.editValueForm.patchValue({
                            ProjectCodeDetailId: dbDetail.ProjectCodeDetailId,
                        });

                        this.projectDetails = new Array;
                        this.projectDetails.push({ label: dbDetail.FullProjectLevelString || "", value: dbDetail.ProjectCodeDetailId });
                    });
            } else {
                this.serviceProDetail.getAll()
                    .subscribe(dbDetail => {
                        this.editValueForm.patchValue({
                            ProjectCodeDetailId: dbDetail[0].ProjectCodeDetailId,
                        });

                        this.projectDetails = new Array;
                        for (let item of dbDetail) {
                            this.projectDetails.push({ label: item.FullProjectLevelString || "", value: item.ProjectCodeDetailId });
                        }
                    });
            }
        }
    }

    // build form
    buildForm(newModel: CuttingPlan): void {
        this.editValueForm = this.fb.group({
            CuttingPlanId: [newModel.CuttingPlanId],
            CuttingPlanNo: [newModel.CuttingPlanNo,
                [
                    Validators.required,
                    Validators.maxLength(250),
                ]
            ],
            Description: [newModel.Description,
                [
                    Validators.maxLength(200),
                ]
            ],
            ProjectCodeDetailId: [newModel.ProjectCodeDetailId,
                [
                    Validators.required,
                ]
            ],
            TypeCuttingPlan: [newModel.TypeCuttingPlan],
            Creator: [newModel.Creator],
            CreateDate: [newModel.CreateDate],
            Modifyer: [newModel.Modifyer],
            ModifyDate: [newModel.ModifyDate],
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // on value changed
    onValueChanged(data?: any): void {
        if (!this.editValueForm) { return; }
        const form = this.editValueForm;
        // on form valid or not
        this.CanSaveAndSelected = form.valid;
        // this.onSelectedValue(form.value);
    }

    // on save CuttingPlan
    onValueSave(): void {
        if (!this.editValueForm) { return; }
        const form = this.editValueForm;
        // on form valid or not
        this.onSelectedValue(form.value);
    }

    // on cancel new model
    onCancelNewModel(): void {
        this.showNewModel = !this.showNewModel;
        this.onSelectedValue(undefined);
    }
}