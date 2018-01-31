import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// service
import { OverTimeMasterService } from "../../services/overtime-master/overtime-master.service";
import { EmployeeGroupService } from "../../services/employee-group/employee-group.service";
import { EmployeeGroupMisService } from "../../services/employee-group/employee-group-mis.service";

import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
// model
import { OptionOverTimeChart } from "../../models/model.index";
// 3rd patry
import { SelectItem } from "primeng/primeng";

@Component({
    selector: "overtime-chart",
    templateUrl: "./overtime-chart.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// overtime-chart component*/
export class OverTimeChartComponent implements OnInit {
    // model
    optionOverTimeChart: OptionOverTimeChart;
    // form
    chartForm: FormGroup;
    // chart data
    public chartLabels: Array<string>;
    public chartData: Array<number>;
    // array
    groupEmployees: Array<SelectItem>;
    projectMasters: Array<SelectItem>;
    modeChartType: Array<SelectItem>;
    /** overtime-chart ctor */
    constructor(
        private service: OverTimeMasterService,
        private serviceGrpEmp: EmployeeGroupService,
        private serviceGrpMis: EmployeeGroupMisService,
        private serviceProMst: ProjectCodeMasterService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        if (!this.chartData) {
            this.chartData = new Array;
        }

        if (!this.chartLabels) {
            this.chartLabels = new Array;
        }

        if (!this.modeChartType) {
            this.modeChartType = new Array;
            this.modeChartType.push({ label: "แสดงชื่อกลุ่มงาน", value: 1 });
            this.modeChartType.push({ label: "แสดงชื่อโครงการ", value: 2 });
        }
        // build form
        this.buildForm();
        //
        this.getEmployeeGroup();
        this.getProjectMaster();
    }

    // build form
    buildForm(): void {
        this.optionOverTimeChart = {
            TypeChart: 1,
            SelectedDate: new Date
        };

        this.chartForm = this.fb.group({
            GroupCode: [this.optionOverTimeChart.GroupCode],
            ProjectMaster: [this.optionOverTimeChart.ProjectMaster],
            SelectedDate: [this.optionOverTimeChart.SelectedDate],
            TypeChart: [this.optionOverTimeChart.TypeChart],
            StartDate: [this.optionOverTimeChart.StartDate],
            EndDate: [this.optionOverTimeChart.EndDate],
        });

        this.chartForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
        this.onValueChanged();
    }

    // on value change
    onValueChanged(data?: any): void {
        if (!this.chartForm) { return; }
        // get data
        this.onGetChartData();
    }

    // get chart data
    onGetChartData(): void {
        let option: OptionOverTimeChart = this.chartForm.value;
        this.service.postOverTimeChartData(option)
            .subscribe(ChartData => {
                this.chartLabels = ChartData.Labels.slice();
                this.chartData = ChartData.Datas.slice();
            }, error => {
                this.setChartData();
            });
    }

    // get employee group array
    getEmployeeGroup(): void {
        this.serviceGrpMis.getAll()
            .subscribe(result => {
                this.groupEmployees = new Array;
                this.groupEmployees.push({ label: "Selected employee group.", value: undefined });
                for (let item of result) {
                    this.groupEmployees.push({ label: item.GroupDesc || "", value: item.GroupMIS });
                }
            }, error => console.error(error));
    }

    // get project master array
    getProjectMaster(): void {
        this.serviceProMst.getAll()
            .subscribe(result => {
                this.projectMasters = new Array;
                this.projectMasters.push({ label: "Selected Job-Number.", value: undefined });
                for (let item of result) {
                    this.projectMasters.push({ label: `${item.ProjectCode}/${item.ProjectName}`, value: item.ProjectCodeMasterId });
                }
            },error => console.error(error));
    }

    // reset
    resetFilter(): void {
        this.buildForm();
        this.onGetChartData();
    }

    // set chart data
    setChartData(): void {
        // remove old label
        this.chartLabels = new Array;
        this.chartData = [1, 1, 1];
    }
}