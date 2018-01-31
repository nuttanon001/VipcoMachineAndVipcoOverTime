import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
// service
import { TaskMachineService } from "../../services/task-machine/task-machine.service";
import { TypeMachineService } from "../../services/type-machine/type-machine.service";
// model
import { OptionChart } from "../../models/model.index";
// 3rd patry
import { SelectItem } from "primeng/primeng";
@Component({
    selector: "task-machine-chart",
    templateUrl: "./task-machine-chart.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// task-machine-chart component*/
export class TaskMachineChartComponent implements OnInit {
    // model
    chart: OptionChart;
    // form
    reportForm: FormGroup;
    // chart
    public chartLabels: Array<string>;
    public chartData: Array<number>;
    chartType: string;
    chartOption: any;
    // array
    typeMachines: Array<SelectItem>;
    machines: Array<SelectItem>;
    // task-machine-chart ctor */
    constructor(
        private service: TaskMachineService,
        private serviceTypeMachine: TypeMachineService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        if (!this.chartLabels) {
            this.chartLabels = new Array;
        }

        this.chartLabels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

        if (!this.chartData) {
            this.chartData = new Array;
        }
        this.chartData = [35, 45, 10, 15, 35, 45, 10, 15,35, 45, 10,15];
        this.chartType = "doughnut";

        this.chartOption = {
            scaleShowVerticalLines: false,
            responsive: true,
            maintainAspectRatio: false
        };

        this.buildForm();
        this.getTypeMachineArray();
    }

    // build form
    buildForm(): void {
        this.chart = {
            EndDate: new Date,
            StartDate: new Date,
        };

        this.reportForm = this.fb.group({
            TypeMachineId: [this.chart.TypeMachineId],
            StartDate: [this.chart.StartDate],
            EndDate: [this.chart.EndDate],
            MachineId: [this.chart.MachineId],
        });

        this.reportForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // on value change
    onValueChanged(data?: any): void {
        if (!this.reportForm) { return; }
        // get data
        this.onGetChartData();
    }

    // get chart data
    onGetChartData(): void {

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
        this.chartLabels = new Array;
        this.chartData = new Array;
        this.buildForm();
        this.onGetChartData();
    }
}