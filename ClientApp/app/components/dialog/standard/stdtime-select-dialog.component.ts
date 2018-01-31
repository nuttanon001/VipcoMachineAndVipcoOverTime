import { Component, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
// models
import { StandardTime, Scroll } from "../../../models/model.index";
// service
import { StandardTimeService } from "../../../services/standard-time/standard-time.service";
import { DataTableServiceCommunicate } from "../../../services/data-table/data-table.service";
// base-component
import { BaseDialogComponent } from "../../base-component/base-dialog.component";
@Component({
    selector: "stdtime-select-dialog",
    templateUrl: "./stdtime-select-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        StandardTimeService,
        DataTableServiceCommunicate
    ]
})
// stdtime-select-dialog component*/
export class StdtimeSelectDialogComponent
    extends BaseDialogComponent<StandardTime, StandardTimeService> implements OnDestroy {
    /** cutting-plan-dialog ctor */
    constructor(
        public service: StandardTimeService,
        public serviceDataTable: DataTableServiceCommunicate<StandardTime>,
        public dialogRef: MatDialogRef<StdtimeSelectDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public mode: number
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );

        this.columns = [
            { prop: "TypeStandardTimeString", name: "Type", flexGrow: 2 },
            { prop: "GradeMaterialString", name: "Grade", flexGrow: 1 },
            { prop: "StandardTimeCode", name: "Code", flexGrow: 1 },
            { prop: "Description", name: "Spec", flexGrow: 2, sortable: false },
            { prop: "CalculatorTime", name: "Total(Min.)", flexGrow: 1, sortable: false }
        ];
    }

    // on init
    onInit(): void {
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
}