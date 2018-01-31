import { Component, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
// models
import { EmployeeGroup, Scroll } from "../../../models/model.index";
// service
// import { EmployeeGroupService } from "../../services/service.index";
import { EmployeeGroupService } from "../../../services/employee-group/employee-group.service";
import { DataTableServiceCommunicate } from "../../../services/data-table/data-table.service";
// base-component
import { BaseDialogComponent } from "../../base-component/base-dialog.component";

@Component({
    selector: "employee-group-dialog",
    templateUrl: "./employee-group-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        EmployeeGroupService,
        DataTableServiceCommunicate
    ]
})
// employee-group-dialog component*/
export class EmployeeGroupDialogComponent
    extends BaseDialogComponent<EmployeeGroup, EmployeeGroupService> implements OnDestroy {
    // employee-group-dialog ctor */
    constructor(
        public service: EmployeeGroupService,
        public serviceDataTable: DataTableServiceCommunicate<EmployeeGroup>,
        public dialogRef: MatDialogRef<EmployeeGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public mode: number
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );

        this.columns = [
            { prop: "GroupCode", name: "GroupCode", flexGrow: 1 },
            { prop: "Description", name: "Description", flexGrow: 2 },
            { prop: "Remark", name: "Remark", flexGrow: 1 },
        ];
    }

    // on init
    onInit(): void {
        this.fastSelectd = true;
    }

    // on get data with lazy load
    loadDataScroll(scroll: Scroll): void {
        if(this.mode) {
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
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}