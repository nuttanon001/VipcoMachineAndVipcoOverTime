﻿import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// service
import { TaskMachineService } from "../../services/task-machine/task-machine.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
// model
import { OptionChart, ChartData } from "../../models/model.index";
// 3rd patry
import { SelectItem } from "primeng/primeng";
import * as moment from "moment-timezone";

@Component({
    selector: "task-machine-chart",
    templateUrl: "./task-machine-chart.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// task-machine-chart component*/
export class TaskMachineChartComponent implements OnInit {
    // task-machine-chart ctor */
    constructor(
        private service: TaskMachineService,
        private serviceTypeMachine: TypeMachineService,
        private fb: FormBuilder,
    ) { }
    //Parameter
    // model
    chart: OptionChart;
    // form
    reportForm: FormGroup;
    // chart
    chartLabel: Array<string>;
    chartData: Array<{ data: Array<number>, label: string }>;
    chartType: string = "";
    chartOption: any;
    xLabel: string = "xLabel";
    yLabel: string = "yLabel";
    isLoading: boolean = false;
    // array
    typeMachines: Array<SelectItem>;
    chartMode: Array<SelectItem>;
    // On Init
    ngOnInit(): void {
        if (!this.chartLabel) {
            this.chartLabel = new Array;
        }
        if (!this.chartData) {
            this.chartData = new Array;
        }
        this.chartType = "bar";

        if (!this.chartMode) {
            this.chartMode = new Array;
            this.chartMode.push({ label: "ข้อมูลการผลิตต่อเดือน", value: 1 });
            this.chartMode.push({ label: "ข้อมูลเวลาเครื่องจักรต่อเดือน", value: 2 });
            this.chartMode.push({ label: "ข้อมูล Plan/Actual ต่อเดือน", value: 3 });
        }

        this.buildForm();
        this.getTypeMachineArray();
    }

    // build form
    buildForm(): void {
        this.chart = {
            EndDate: new Date,
            StartDate: new Date,
            ChartMode: 1,
        };
        if (this.chart.StartDate) {
            this.chart.StartDate.setMonth(this.chart.StartDate.getMonth() - 1);
        }

        this.reportForm = this.fb.group({
            TypeMachineId: [this.chart.TypeMachineId],
            StartDate: [this.chart.StartDate],
            EndDate: [this.chart.EndDate],
            MachineId: [this.chart.MachineId],
            ChartMode:[this.chart.ChartMode],
        });

        this.reportForm.valueChanges.debounceTime(500).subscribe((data: any) => this.onValueChanged(data));
        this.onValueChanged();
    }

    // on value change
    onValueChanged(data?: any): void {
        if (!this.reportForm) { return; }
        // get data
        this.onGetChartData();
    }

    // get chart data
    onGetChartData(): void {
        if (!this.reportForm) { return; }
        this.isLoading = true;
        let option: OptionChart = this.reportForm.value;

        if (option.ChartMode === 1) {
            this.xLabel = "Quantity material";
            this.yLabel = "Machine name";
        } else if (option.ChartMode === 2 || option.ChartMode === 3) {
            this.xLabel = "Percent work";
            this.yLabel = "Machine name";
        }
        // debug here
        // console.log("Label",this.xLabel, this.yLabel);

        let zone: string = "Asia/Bangkok";
        if (option.StartDate !== null) {
            option.StartDate = moment.tz(option.StartDate, zone).toDate();
        }
        if (option.EndDate !== null) {
            option.EndDate = moment.tz(option.EndDate, zone).toDate();
        }

        let SubAction: string = option.ChartMode === 1 ? "TaskMachineChartDataProduct/" :
            (option.ChartMode === 2 ? "TaskMachineChartDataWorkLoad/" : "TaskMachineChartDataPlanAndActual/")

        this.service.postTaskMachineChartData(option, SubAction)
            .subscribe(ChartData => {
                this.chartLabel = [...ChartData.Labels];
                this.chartData = new Array;
                ChartData.Datas.forEach((item: any) => {
                    if (item) {
                        let chartData:ChartData =
                            {
                                data: item.DataChart,
                                label: item.Label
                            };
                        this.chartData.push(chartData);
                    }
                });
                this.isLoading = false;
            }, error => {
                this.setChartData();
            });
    }

    // get type machine array
    getTypeMachineArray(): void {
        this.serviceTypeMachine.getAll()
            .subscribe(result => {
                this.typeMachines = new Array;
                this.typeMachines.push({ label: "Selected type machine.", value: undefined });
                for (let item of result) {
                    this.typeMachines.push({ label: item.TypeMachineCode || "", value: item.TypeMachineId });
                }
            }, error => console.error(error));
    }

    // reset
    resetFilter(): void {
        this.chartLabel = new Array;
        this.chartData = new Array;
        this.buildForm();
        this.onGetChartData();
    }

    // set chart data
    setChartData(): void {
        // remove old label
        this.chartLabel = new Array;
        this.chartData = new Array;
    }
}