import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { StandardTime, GradeMaterial } from "../../../models/model.index";
// service
// import { StandardTimeService } from "../../services/standard-time/standard-time.service";
import { GradeMaterialService } from "../../../services/grade-material/grade-material.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// primeng
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "standard-time-dialog",
    templateUrl: "./standard-time-dialog.component.html",
    styleUrls: [
        "../../../styles/master.style.scss",
        "../../../styles/edit.style.scss"
    ],
    providers: [
        GradeMaterialService,
    ]
})
// standard-time-dialog component*/
export class StandardTimeDialogComponent implements OnInit {
    grades: Array<SelectItem>;
    standardForm: FormGroup;
    /** standard-time-dialog.component ctor */
    constructor(
        private service: GradeMaterialService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<StandardTimeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public standardTime: StandardTime
    ) { }

    /** Called by Angular after standard-time-dialog.component component initialized */
    ngOnInit(): void {
        this.standardForm = this.fb.group({
            StandardTimeId: [this.standardTime.StandardTimeId],
            StandardTimeCode: [this.standardTime.StandardTimeCode,
                [
                    Validators.required,
                    Validators.maxLength(50)
                ]
            ],
            Description: [this.standardTime.Description,
                [
                    Validators.required,
                    Validators.maxLength(200)
                ]
            ],
            Remark: [this.standardTime.Remark,
                [
                    Validators.maxLength(200)
                ]
            ],
            StandardTimeValue: [this.standardTime.StandardTimeValue],
            PreparationBefor: [this.standardTime.PreparationBefor],
            PreparationAfter: [this.standardTime.PreparationAfter],
            Creator: [this.standardTime.Creator],
            CreateDate: [this.standardTime.CreateDate],
            Modifyer: [this.standardTime.Modifyer],
            ModifyDate: [this.standardTime.ModifyDate],
            GradeMaterialId: [this.standardTime.GradeMaterialId,
                [
                    Validators.required,
                ]
            ],
            GradeMaterialString: [this.standardTime.GradeMaterialString],
            TypeStandardTimeId: [this.standardTime.TypeStandardTimeId],
        });

        // control on value change
        const controlStandard: AbstractControl|null = this.standardForm.get("GradeMaterialId");
        if (controlStandard) {
            controlStandard.valueChanges.subscribe((data: any) => this.onValueChange(data));
        }

        this.service.getAll()
            .subscribe(dbData => {
                this.grades = new Array;
                this.grades.push({ label: "-", value: undefined });
                for (let item of dbData) {
                    this.grades.push({ label: item.GradeName || "", value: item.GradeMaterialId });
                }
            }, error => console.error(error));
    }

    onValueChange(data?: any): void {
        if (!this.standardForm) { return; }

        const form:FormGroup = this.standardForm;
        // check selectedMachine or selectedTool
        const controlStandard:AbstractControl|null = form.get("GradeMaterialId");
        if (controlStandard) {
            if (controlStandard.value) {
                let comBoBoxItem:SelectItem|undefined = this.grades.find(value => value.value === controlStandard.value);
                if (comBoBoxItem) {
                    form.patchValue({ GradeMaterialString: comBoBoxItem.label });
                }
            }
        }
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // update Click
    onUpdateClick(): void {
        this.dialogRef.close(this.standardForm.value);
    }
}