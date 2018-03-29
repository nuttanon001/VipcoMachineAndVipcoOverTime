import { Component, OnInit, Input, OnChanges, ViewChild } from "@angular/core";
import { ChartData } from "../../models/model.index";
// 3rd praty
import { BaseChartDirective } from "ng2-charts";
 
// <!--[datasets]="barChartData"-- >

@Component({
    selector: "base-chart2",
    template: `
    <div class="chart2">
        <canvas
            baseChart
            [chartType]="'horizontalBar'"
            [datasets]="chartData"
            [labels]="chartLabels"
            [options]="chartOptions"
            [legend]="true"
            (chartClick)="onChartClick($event)">
        </canvas>
    </div>
    `,
    styleUrls: ["../../styles/schedule.style.scss"],
})
// base-chart component*/
export class BaseChartComponent2 implements OnChanges {
    /** base-chart ctor */
    constructor() {}
    // Parameter
    chartData = [
        { data: [330, 600, 260, 700], label: 'Account A' },
        { data: [120, 455, 100, 340], label: 'Account B'},
        { data: [45, 67, 800, 500], label: 'Account C' }
    ];
    chartLabels = ['January', 'February', 'Mars', 'April'];
    backgroundColor:
        [
            "#FF5733", "#BE5DE2", "#DA3B5F", "#FCF3CF", "#5D6D7E",
            "#5DADE2", "#B03A2E", "#979A9A", "#8E44AD", "#52BE80",
            "#B8436D", "#00D9F9", "#A4C73C", "#A4ADD3", "#F4D03F",
            "#5DADE2", "#B03A2E", "#979A9A", "#8E44AD", "#52BE80"
        ];

    @Input() newChartLabel: Array<string>;
    @Input() newChartData: Array<{ data: Array<number>, label: string }>;
    //
    @Input() xAxesLabel: string = "LabelX";
    @Input() yAxesLabel: string = "LabelY";

    chartOptions = {
        responsive: true,
        legend: { position: "left" },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: this.xAxesLabel
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: this.yAxesLabel
                }
            }]
        },
    };
    // on input change
    ngOnChanges(SomeData: any): void {
        // debug here
        // console.log("OnChanges");
        if (this.newChartLabel) {
            let removeLable: number = this.chartLabels.length;
            if (!this.newChartLabel.length) {
                // add template label
                for (let i: number = 0; i < 3; i++) {
                    this.chartLabels.push("NoData");
                }
                // remove old label
            } else {
                for (let label of this.newChartLabel) {
                    this.chartLabels.push(label);
                }
            }
            this.chartLabels.splice(0, removeLable);
        }

        if (this.newChartData) {
            if (this.newChartData.length > 0) {
                let removeDateSet: number = this.chartData.length;
                this.newChartData.forEach((newData, index) => {
                    this.chartData.push(newData);
                })
                this.chartData.splice(0, removeDateSet);

                // when add or remove dataset need do this for chartlabels
                this.chartLabels = [...this.chartLabels];
            }
        }

        if (this.xAxesLabel && this.yAxesLabel) {
            this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.xAxesLabel;
            this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.yAxesLabel;
        }
    }

    // on chart click
    onChartClick(event:any) {
        console.log(event);
    }

    // on add new data point
    newDataPoint(dataArr = [100, 100, 100], label:any) {
        if (this.chartData) {
            this.chartData.forEach((dataset, index) => {
                this.chartData[index] = Object.assign({}, this.chartData[index], {
                    data: [...this.chartData[index].data, dataArr[index]]
                });
            });

            this.chartLabels = [...this.chartLabels, label];
        }
    }

    // Update data set ex
    newDataSetPoint() {
        //let newData = {
        //    data: [112, 420, 212, 412], label: 'Account D'
        //}
        
        //this.chartData.push(newData);
        //this.chartData.splice(0, 2);

        //// when add or remove dataset need do this for chartlabels
        //this.chartLabels = [...this.chartLabels];
    }

}