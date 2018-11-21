import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { BomMasterService } from '../../../services/overtime-master/bom-master.service';
import { BomLevel } from '../../../models/overtime-master/bom-master.model';
import { TableColumn, DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BaseDialogComponent } from '../../base-component/base-dialog.component';
import { Scroll } from "../../../models/page/page.model";
import { DataTableServiceCommunicate } from '../../../services/data-table/data-table.service';

@Component({
    selector: 'app-bom-dialog',
    templateUrl: './bom-dialog.component.html',
    styleUrls: ["../../../styles/master.style.scss", "../../../styles/edit.style.scss"],
    providers: [
        BomMasterService,
        DataTableServiceCommunicate
    ]
})
/** bom-dialog component*/
export class BomDialogComponent extends BaseDialogComponent<BomLevel, BomMasterService> implements OnDestroy {
    boms: Array<BomLevel> = new Array;
    template: Scroll = {};
 
    // employee-by-group-mis-dialog ctor */
    constructor(
        public service: BomMasterService,
        public serviceDataTable: DataTableServiceCommunicate<BomLevel>,
        public dialogRef: MatDialogRef<BomDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public bomCode: string
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );

        this.columns = [
            { prop: "BomLevelCode", name: "Code", flexGrow: 1 },
            { prop: "BomLevelName", name: "Name", flexGrow: 1 },
        ];
    }

    // on init
    onInit(): void {
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

    // on destory
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
