// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { UnitsMeasure, Scroll } from "../../models/model.index";
// service
import { UnitMeasureService } from "../../services/units-measure/units-measure.service";
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// base-component
import { BaseDialogComponent } from "../base-component/base-dialog.component";

@Component({
    selector: "uom-dialog",
    templateUrl: "./uom-dialog.component.html",
    styleUrls: [
        "../../styles/master.style.scss",
        "../../styles/edit.style.scss"
    ],
    providers: [
        UnitMeasureService,
        DataTableServiceCommunicate
    ]

})
/** uom-dialog component*/
export class UomDialogComponent
    extends BaseDialogComponent<UnitsMeasure, UnitMeasureService> implements OnDestroy
{
    subscription2: Subscription;
    showNewModel: boolean = true;
    CanSaveAndSelected: boolean = false;

    // FormGroup
    editValueForm: FormGroup;
    /** uom-dialog ctor */
    constructor(
        public service: UnitMeasureService,
        public serviceDataTable: DataTableServiceCommunicate<UnitsMeasure>,
        public dialogRef: MatDialogRef<UomDialogComponent>,
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
            { prop: "UnitMeasureName", name: "uom.", flexGrow: 3 },
        ];

        this.fastSelectd = true;
    }

    // on get data with lazy load
    loadDataScroll(scroll: Scroll): void {
        this.service.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // on destroy
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // on new model
    onNewModel(): void {
        this.showNewModel = !this.showNewModel;
        let newModel: UnitsMeasure = {
            UnitMeasureId: 0
        };
        //Clear Selected
        this.selected = undefined;
        // build form
        this.buildForm(newModel);
    }

    // build form
    buildForm(newModel: UnitsMeasure): void {
        this.editValueForm = this.fb.group({
            UnitMeasureId: [newModel.UnitMeasureId],
            UnitMeasureName: [newModel.UnitMeasureName,
                [
                    Validators.required,
                    Validators.maxLength(25),
                ]
            ],
            Creator: [newModel.Creator],
            CreateDate: [newModel.CreateDate],
            Modifyer: [newModel.Modifyer],
            ModifyDate: [newModel.ModifyDate]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // on value changed
    onValueChanged(data?: any): void {
        if (!this.editValueForm) { return; }
        const form = this.editValueForm;
        // on form valid or not
        this.CanSaveAndSelected = form.valid;
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