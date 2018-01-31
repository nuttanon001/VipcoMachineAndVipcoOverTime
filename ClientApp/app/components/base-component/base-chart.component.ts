import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "base-chart",
    template: `
    <div class="chart">
        <canvas baseChart
                [data]="chartData"
                [labels]="chartLabels"
                [colors]="chartColors"
                [options]="chartOption"
                [chartType]="chartType">
        </canvas>
    </div>
    `,
    styleUrls: ["../../styles/schedule.style.scss"],
})
// base-chart component*/
export class BaseChartComponent implements OnInit {
    // chart data
    _chartLabels: Array<string>;
    _chartData: Array<number>;
    // input chart labels
    @Input("chartLabels")
    set chartLabels(_Label: Array<string>) {
        if (!_Label.length) {
            let removeLable: number = this._chartLabels.length;
            // add template label
            for (let i:number = 0; i < 3; i++) {
                this._chartLabels.push("NoData");
            }
            // remove old label
            this._chartLabels.splice(0, removeLable);
        } else {
            let removeLable: number = this._chartLabels.length || 0;
            for (let label of _Label) {
                this._chartLabels.push(label);
            }
            this._chartLabels.splice(0, removeLable);
        }
    }
    get chartLabels(): Array<string> { return this._chartLabels; }
    // input chart data
    @Input("chartData")
    set chartData(_Data: Array<number>) {
        this._chartData = _Data.slice();
    }
    get chartData(): Array<number> { return this._chartData; }
    // chart color
    chartColors: Array<any>;
    chartType: string;
    chartOption: any;
    /** base-chart ctor */
    constructor() {
        this._chartLabels = ["NoData", "NoData", "NoData"];
        this._chartData = [1, 1, 1];
    }

    ngOnInit(): void {
        if (!this.chartLabels) {
            this.chartLabels = new Array;
            this.chartLabels = ["NoData", "NoData", "NoData"];
        }
        if (!this.chartData) {
            this.chartData = new Array;
            this.chartData = [1, 1, 1];

        }
        this.chartType = "doughnut";
        this.chartOption = {
            scaleShowVerticalLines: false,
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: "left" }
        };

        if (!this.chartColors) {
            this.chartColors = new Array;
            this.chartColors = [{
                backgroundColor: [
                    "#FF5733", "#BE5DE2", "#DA3B5F", "#FCF3CF", "#5D6D7E",
                    "#5DADE2", "#B03A2E", "#979A9A", "#8E44AD", "#52BE80",
                    "#B8436D", "#00D9F9", "#A4C73C", "#A4ADD3", "#F4D03F",
                ]
            }];
        }
    }
}