import { Component, OnInit, OnDestroy, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
import { Material, Scroll } from "../../models/model.index";
// service
import { DataTableServiceCommunicate } from "../../services/data-table/data-table.service";
import { MaterialService } from "../../services/material/material.service";
// rxjs
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";

@Component({
    selector: "material-dialog",
    templateUrl: "./material-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
    providers: [
        MaterialService,
        DataTableServiceCommunicate
    ]
})

/** material-dialog component*/
export class MaterialDialogComponent implements OnInit, OnDestroy
{
    selectedMat: Material | undefined;
    subscription: Subscription;
    columns: Array<TableColumn> = [
        { prop: "ClassificationString", name: "Class", flexGrow: 1 },
        { prop: "GradeString", name: "Grade", flexGrow:1 },
        { prop: "Description", name: "Description", flexGrow: 2 },
    ];
    // property
    get CanSelected(): boolean {
        return this.selectedMat !== undefined;
    }

    /** material-dialog ctor */
    constructor(
        private serviceMaterial: MaterialService,
        private serviceDataTable: DataTableServiceCommunicate<Material>,
        public dialogRef: MatDialogRef<MaterialDialogComponent>
    ) { }

    /** Called by Angular after material-dialog component initialized */
    ngOnInit(): void {
        this.subscription = this.serviceDataTable.ToParent$
            .subscribe((scroll: Scroll) => this.loadData(scroll));
    }

    // angular hook
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // on get data with lazy load
    loadData(scroll: Scroll): void {
        this.serviceMaterial.getAllWithScroll(scroll)
            .subscribe(scrollData => {
                if (scrollData) {
                    this.serviceDataTable.toChild(scrollData);
                }
            }, error => console.error(error));
    }

    // Selected Material
    onSelectedMaterial(material?: Material): void {
        if (material) {
            this.selectedMat = Object.assign({}, material);
        }
    }

    // No Click
    onCancelClick(): void {
        this.dialogRef.close();
    }

    // Update Click
    onSelectedClick(): void {
        this.dialogRef.close(this.selectedMat);
    }
}