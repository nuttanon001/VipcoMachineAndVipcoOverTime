import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { ChartData } from "../../models/model.index";
 
// <!--[datasets]="barChartData"-- >

@Component({
    selector: "base-chart2",
    template: `
    <div style="display: block">
        <canvas baseChart
            [datasets]="chartData"
            [labels]="chartLabels"
            [options]="barChartOptions"
            [legend]="barChartLegend"
            [chartType]="barChartType"
            (chartHover)="chartHovered($event)"
            (chartClick)="chartClicked($event)">
        </canvas>
    </div>
    `,
    styleUrls: ["../../styles/schedule.style.scss"],
})
// base-chart component*/
export class BaseChartComponent2 implements OnInit, OnChanges {

    /** base-chart ctor */
    constructor() {
        this._chartLabels = ["NoData", "NoData", "NoData"];
        this._chartData = [{
            data: [1,1,1],
            label: 'Series A'
        }];
    }

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
    };
    // chart data
    _chartData: Array<any>;
    _chartLabels: Array<string>;
    // input chart labels
    @Input("chartLabels")
    set chartLabels(_Label: Array<string>) {
        if (!_Label.length) {
            let removeLable: number = this._chartLabels.length;
            // add template label
            for (let i: number = 0; i < 3; i++) {
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
    set chartData(_Data: Array<any>) {
        if (!_Data.length) {
            let removeLable: number = this._chartData.length;
            // add template label
            this._chartData.push({
                data: [1, 1, 1],
                label: 'Series A'
            });
            // remove old label
            this._chartData.splice(0, removeLable);
        } else {
            let removeLable: number = this._chartData.length || 0;
            for (let label of _Data) {
                this._chartData.push(label);
            }
            this._chartData.splice(0, removeLable);
        }

        // debug here
        console.log("ChartData Set", this._chartData);
    }
    get chartData(): Array<any> {
        // debug here
        console.log("ChartData Get", this._chartData);
        return this._chartData;
    }

    public barChartType: string = 'horizontalBar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        {
            data: [65, 59, 80, 81, 56, 55, 40],
            label: 'Series A'
        }
    ];

    @Input() public ChartData: any[] = [];
    @Input() public ChartLabel: string[] = [];
    ngOnInit(): void {
        // debug here
    }

    ngOnChanges(): void {
        if (this.ChartData) {
            if (this.ChartData.length > 0) {
                console.log(this.ChartData);

                //let removeData: number = this.ChartData.length || 0;
                //let clone = JSON.parse(JSON.stringify(this.barChartData));
                //this.ChartData.forEach((item, index) => {
                //    if (clone[index] != null) {
                //        clone[index] = item;
                //    } else {
                //        clone.push(item);
                //    }
                //});
                //clone.splice(0, removeData);
                //console.log(clone);
                //this.barChartData = clone.slice();

                this.barChartData = this.ChartData.slice();
            }
        }
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
   
}