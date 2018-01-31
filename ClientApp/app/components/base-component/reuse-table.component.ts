import {
    Component, Input, Output,
    EventEmitter, OnInit,
    ElementRef, ViewChild
} from "@angular/core";
// rxjs
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "reuse-table",
    template: `
    <div class="view-container">
        <ngx-datatable
            class="material"
            [rows]="rows"
            [columns]="columns"
            [columnMode]="'flex'"
            [headerHeight]="50"
            [footerHeight]="0"
            [rowHeight]="50"
            [scrollbarV]="true"
            [selectionType]="'single'"
            (select)="onSelect($event)"
            [style.height]="height">
        </ngx-datatable>
    </div>
  `,
    styleUrls: ["./data-table.style.scss"],
})

export class ReuseTableComponent implements OnInit {
    // input and output
    @Input("columns") columns: any;
    @Input("rows") rows: Array<any>;
    @Input("height") height: string = "calc(100vh - 184px)";
    @Output("selected") selected = new EventEmitter<any>();
    // height: string;
    constructor() { }
    // angular hook init
    ngOnInit(): void {
        // this.height = "calc(100vh - 184px)";

        // console.log(window);
    }
    // emit row selected to output
    onSelect(selected: any): void {
        if (selected) {
            this.selected.emit(selected.selected[0]);
        }
    }
}