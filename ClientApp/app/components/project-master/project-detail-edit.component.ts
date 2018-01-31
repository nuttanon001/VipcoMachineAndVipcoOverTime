import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { ProjectCodeDetail } from "../../models/model.index";
// services
import { TemplateProjectDetailService } from "../../services/service.index";
import { ProjectCodeDetailService } from "../../services/projectcode-detail/projectcode-detail.service";
// primeng
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "project-detail-edit",
    templateUrl: "./project-detail-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// project-detail-edit component*/
export class ProjectDetailEditComponent implements OnInit {
    templateCode: Array<SelectItem>;
    detailForm: FormGroup;
    // project-detail-edit ctor */
    tempProjectDetails: Array<string>;
    projectDetails: Array<string>;
    constructor(
        private service: TemplateProjectDetailService,
        private serviceDetail: ProjectCodeDetailService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProjectDetailEditComponent>,
        @Inject(MAT_DIALOG_DATA) public detail: ProjectCodeDetail
    ) { }

    /** Called by Angular after project-detail-edit component initialized */
    ngOnInit(): void {
        if (!this.tempProjectDetails) {
            this.tempProjectDetails = new Array;
            this.serviceDetail.getAutoComplateProjectDetailCode()
                .subscribe(dbProjectDetailCode => {
                    this.tempProjectDetails = dbProjectDetailCode;
                });
        }
        if (!this.projectDetails) {
            this.projectDetails = new Array;
        }

        this.detailForm = this.fb.group({
            ProjectCodeDetailId: [this.detail.ProjectCodeDetailId],
            ProjectCodeDetailCode: [this.detail.ProjectCodeDetailCode,
                [
                    Validators.required,
                ]
            ],
            Description: [this.detail.Description,
                [
                    Validators.maxLength(200)
                ]
            ],
            ProjectCodeMasterId: [this.detail.ProjectCodeMasterId],
            Creator: [this.detail.Creator],
            CreateDate: [this.detail.CreateDate],
            Modifyer: [this.detail.Modifyer],
            ModifyDate: [this.detail.ModifyDate],
        });

        this.service.getAll()
            .subscribe(dbData => {
                this.templateCode = new Array;
                this.templateCode.push({ label: "-", value: undefined });
                for (let item of dbData) {
                    this.templateCode.push({ label: item.TemplateName || "", value: item.TemplateName || "" });
                }
            }, error => console.error(error));
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // update Click
    onUpdateClick(): void {
        this.dialogRef.close(this.detailForm.value);
    }

    // on search autocomplate
    onSearchAutoComplate(event: any): void {
        this.projectDetails = new Array;

        for (let i: number = 0; i < this.tempProjectDetails.length; i++) {
            let projectDetails: string = this.tempProjectDetails[i];
            if (projectDetails.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.projectDetails.push(projectDetails);
            }
        }
    }
}