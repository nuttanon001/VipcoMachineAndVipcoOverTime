import { Component, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
// models
import { EmployeeGroupMis, Scroll } from "../../../models/model.index";
// service
import { EmployeeGroupMisService } from "../../../services/employee-group/employee-group-mis.service";
import { DataTableServiceCommunicate } from "../../../services/data-table/data-table.service";
// base-component
import { BaseDialogComponent } from "../../base-component/base-dialog.component";

@Component({
    selector: "empoyee-groupmis-dialog",
    templateUrl: "./empoyee-groupmis-dialog.component.html",
    styleUrls: ["../../../styles/master.style.scss"],
    providers: [
        EmployeeGroupMisService,
        DataTableServiceCommunicate
    ]
})
// empoyee-groupmis-dialog component*/
export class EmpoyeeGroupmisDialogComponent
    extends BaseDialogComponent<EmployeeGroupMis, EmployeeGroupMisService> implements OnDestroy {
    // empoyee-groupmis-dialog ctor */
    constructor(
        public service: EmployeeGroupMisService,
        public serviceDataTable: DataTableServiceCommunicate<EmployeeGroupMis>,
        public dialogRef: MatDialogRef<EmpoyeeGroupmisDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public mode: number
    ) {
        super(
            service,
            serviceDataTable,
            dialogRef
        );

        this.columns = [
            { prop: "GroupMIS", name: "GroupMisCode", flexGrow: 1 },
            { prop: "GroupDesc", name: "Description", flexGrow: 2 },
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
                // console.log(JSON.stringify(scrollData.Scroll));
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