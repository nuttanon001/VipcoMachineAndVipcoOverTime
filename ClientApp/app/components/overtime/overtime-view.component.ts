// angular
import { Component, Output, EventEmitter, Input } from "@angular/core";
// models
import { OverTimeMaster, OverTimeDetail } from "../../models/model.index";
// components
import { BaseViewComponent } from "../base-component/base-view.component";
// services
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
import { OverTimeDetailService } from "../../services/overtime-detail/overtime-detail.service";
// 3rd party
import { TableColumn } from "@swimlane/ngx-datatable";
@Component({
    selector: "overtime-view",
    templateUrl: "./overtime-view.component.html",
    styleUrls: ["../../styles/view.style.scss"],
})
// overtime-view component*/
export class OvertimeViewComponent extends BaseViewComponent<OverTimeMaster> {
    lastOverTimeMaster: OverTimeMaster;
    @Input("height") height: string = "calc(100vh - 184px)";
    details: Array<OverTimeDetail>;
    columns: Array<TableColumn> = [
        { prop: "EmpCode", name: "Employee Code", flexGrow: 1 },
        { prop: "EmployeeString", name: "Employee Name", flexGrow: 1 },
        { prop: "StartOverTime", name: "StartOT", flexGrow: 1 },
        { prop: "TotalHour", name: "Hour", flexGrow: 1 },
        { prop: "Remark", name: "Remark", flexGrow: 1 },
        { prop: "StatusString", name: "Status", flexGrow: 1, cellClass: this.getCellClass }
    ];

    typeCodes =
    [
        { label: "-", value: undefined },
        { label: "Pre-Fabricate", value: "01" },
        { label: "Trial-Assembly", value: "02" },
        { label: "Finishing", value: "03" },
        { label: "Paint/Galvanize", value: "04" },
        { label: "Insulation/Refractory", value: "05" },
        { label: "Packing", value: "06" },
        { label: "Delivery", value: "07" },
        { label: "Weld", value: "08" },
        { label: "Machine", value: "09" },
        { label: "Draft", value: "10" },
        { label: "Draft Rework", value: "11" },
        { label: "Paint/Galvanize Rework", value: "12" },
        { label: "Test Coupon", value: "13" },
        { label: "Stub Weld", value: "14" },
        { label: "Header Fabrication", value: "15" },
        { label: "Harp Fabrication", value: "16" },
        { label: "Hydro test & Dry out", value: "17" },
        { label: "Pre Fab MA Pipe", value: "18" },
        { label: "Piping Module Assembly", value: "19" },
        { label: "Structure Module Assembly", value: "20" },
        { label: "Punch List", value: "21" },
        { label: "Don't have activity", value: "99" },
        ];
    typeCode: string = "";
    /** overtime-view ctor */
    constructor(
        private service: OverTimeDetailService,
        private serviceMaster: OverTimeMasterService,
    ) { super(); }

    // load more data
    onLoadMoreData(value: OverTimeMaster): void {
        this.lastOverTimeMaster = {
            OverTimeMasterId: 0,
            OverTimeDate: new Date()
        };

        if (this.displayValue) {
            if (this.displayValue.InfoActual) {
                this.displayValue.InfoActual = this.onReplaceMuitLine(this.displayValue.InfoActual);
            }

            if (this.displayValue.InfoPlan) {
                this.displayValue.InfoPlan = this.onReplaceMuitLine(this.displayValue.InfoPlan);
            }
        }

        if (value) {
            const temp = this.typeCodes.find(item => item.value == value.TypeCode);
            if (temp) {
                this.typeCode = temp.label;
            }

            this.service.getByMasterId(value.OverTimeMasterId)
                .subscribe(dbDetail => {
                    this.details = dbDetail.filter((item, index) => {
                        return item.OverTimeDetailStatus !== 2;
                    }).slice();
                });

            if (value.LastOverTimeId) {
                this.serviceMaster.getOneKeyNumber(value.LastOverTimeId)
                    .subscribe(dbLastMaster => {
                        this.lastOverTimeMaster = dbLastMaster;
                        if (this.lastOverTimeMaster.InfoActual) {
                            this.lastOverTimeMaster.InfoActual = this.onReplaceMuitLine(this.lastOverTimeMaster.InfoActual);
                        }

                        if (this.lastOverTimeMaster.InfoPlan) {
                            this.lastOverTimeMaster.InfoPlan = this.onReplaceMuitLine(this.lastOverTimeMaster.InfoPlan);
                        }
                    });
            }
        }

    }

    onReplaceMuitLine(text: string): string {
        if (text) {
            return text.replace(new RegExp("\n", "g"), "<br />");
        }
        return "";
    }

    // cell change style
    getCellClass({ row, column, value }: any): any {
        if (value === "Use") {
            return { "is-wait": true };
        } else if (value === "Cancel") {
            return { "is-cancel": true };
        } else {
            return { "is-wait": true };
        }
    }
}