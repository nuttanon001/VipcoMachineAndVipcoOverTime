import {
    Component, Input, Output,
    EventEmitter, OnInit, OnDestroy,
    ElementRef, ViewChild
} from "@angular/core";
// models
import { Page, PageData, Scroll, ScrollData } from "../../models/model.index";
// services
import { DataTableServiceCommunicate } from "../../services/service.index";
// rxjs
import { Subscription } from "rxjs/Subscription";
import { MatCheckbox } from "@angular/material";

@Component({
    selector: "data-table",
    template: `
    <div class="upper-tool">
        <search-box (search)="onFilter($event)" class="w-50"></search-box>
        <mat-checkbox id="checkBox" #checkBox [disabled]="isDisabled" (change)="onCondition($event)" class="w-50">
            Filter Only User
        </mat-checkbox>
    </div>
    <ngx-datatable
        class="material datatable-scrolling"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="'flex'"
        [headerHeight]="headerHeight"
        [rowHeight]="rowHeight"
        [footerHeight]="0"
        [scrollbarV]="true"
        [loadingIndicator]="isLoading"
        (scroll)="onScroll($event.offsetY)"
        [externalSorting]="true"
        (sort)="onSort($event)"
        [selectionType]="'single'"
        [rowClass]="getRowClass"
        (select)="onSelect($event)"
        [style.height]="height">
    </ngx-datatable>
  `,
    styleUrls: ["./data-table.style.scss"],
})

export class DataTableComponent implements OnInit,OnDestroy {
    rows: Array<any> = new Array<any>();
    _onlyUser: boolean = true;
    // view chlid
    @ViewChild("checkBox") checkBox: MatCheckbox;
    // input and output
    @Output("selected") selected = new EventEmitter<any>();
    @Input("height") height: string = "calc(100vh - 165px)";
    @Input("isDisabled") isDisabled: boolean = true;

    @Output() onlyUserChange = new EventEmitter<boolean>();
    @Input()
    get onlyUser():boolean {
        return this._onlyUser;
    }
    set onlyUser(value:boolean) {
        this._onlyUser = value;
        this.onlyUserChange.emit(this._onlyUser);
    }

    // columns get set
    private _columns: any;
    @Input("columns")
    set columns(setColumns: any) {
        this._columns = setColumns;
        if (setColumns) {
            setTimeout(() => {
                if (this.checkBox) {
                    if (this.isDisabled === false) {
                        this.checkBox.checked = !this.isDisabled;

                        // console.log("onCondition");
                        this.onCondition(this.checkBox);
                        return;
                    }
                }
                // console.log("columns");
                this.onScroll(0);
            }, 150);
        }
    }
    get columns(): any { return this._columns; }

    readonly headerHeight = 50;
    readonly rowHeight = 50;
    readonly pageLimit = 10;

    scroll: Scroll = {
        Skip: 0,
        Take: 0,
    };
    // boolean
    isLoading: boolean;
    isFilter: boolean;
    isSort: boolean;
    isForce: boolean = false;
    templateLimit: number;
    // subscription
    subscription: Subscription;
    subscription2: Subscription;
    constructor(
        private dataTableService: DataTableServiceCommunicate<any>,
        private el: ElementRef
    ) { }

    // angular hook init
    ngOnInit(): void {
        // this.onScroll(0);
        // wait load data
        this.subscription = this.dataTableService.toChild$
            .subscribe((scrollData: ScrollData<any>) => {
                // debug here
                // console.log("Row", this.rows);
                if (scrollData && scrollData.Data && scrollData.Data.length > 0) {
                    if (scrollData.Scroll) {
                        if (scrollData.Scroll.Reload) {
                            this.rows = scrollData.Data.slice();
                            return;
                        }

                        if (this.isSort || this.isFilter) {
                            this.rows = scrollData.Data.slice();
                            this.isSort = false;
                            this.isFilter = false;
                            return;
                        }
                    }

                    if (this.isForce) {
                        this.rows.splice(0, this.templateLimit);
                        this.isForce = false;

                        scrollData.Data.forEach(item => {
                            this.rows.push(item);
                        });

                    } else {
                        this.rows.push(...scrollData.Data);
                    }
                    // debug here
                    // console.log("Row:", JSON.stringify(this.rows));
                } else {
                    if (this.isFilter) {
                        this.rows = new Array;
                        this.isFilter = false;
                    }
                }
                this.isLoading = false;
            });

        this.subscription2 = this.dataTableService.ToReload$
            .subscribe((reload: boolean) => {
                // this.rows = new Array<any>();
                if (!this.templateLimit) {
                    this.templateLimit = this.rows.length;
                }
                this.loadPage2(0,this.templateLimit);
            });
    }

    // angular hook destroy
    ngOnDestroy(): void {
        if (this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
        }

        if (this.subscription2) {
            this.subscription2.unsubscribe();
        }
    }

    // emit row selected to output
    onSelect(selected: any): void {
        // if (selected) {
        //    this.selected.emit(selected.selected[0]);
        // }

        this.selected.emit(selected.selected[0]);
    }

    // on Scroll bar
    onScroll(offsetY: number): void {
        // total height of all rows in the viewport
        const viewHeight:number = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
        
        // check if we scrolled to the end of the viewport
        if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight) {

            // total number of results to load
            let limit:number = this.pageLimit;

            // check if we haven't fetched any results yet
            if (this.rows.length === 0) {

                // calculate the number of rows that fit within viewport
                const pageSize:number = Math.ceil(viewHeight / this.rowHeight);

                // change the limit to pageSize such that we fill the first page entirely
                // (otherwise, we won't be able to scroll past it)
                limit = Math.max(pageSize, this.pageLimit);
            }

            this.loadPage(limit);
        }
    }

    // loadPage
    private loadPage(limit: number): void {
        // console.log("loadPage");

        // set the loading flag, which serves two purposes:
        // 1) it prevents the same page from being loaded twice
        // 2) it enables display of the loading indicator
        this.isLoading = true;
        this.scroll.Skip = this.rows.length;
        this.scroll.Take = limit;
        // Template Load
        this.templateLimit = limit + (this.rows.length || 0);

        // debug here
        // console.log("Scroll here :", this.scroll);

        this.dataTableService.toParent(this.scroll);

        // this.serverResultsService.getResults(this.rows.length, limit).subscribe(results => {
        //    this.rows.push(...results.data);
        //    this.isLoading = false;
        // });
    }

    private loadPage2(skip: number,limit: number): void {
        // console.log("loadPage");

        // set the loading flag, which serves two purposes:
        // 1) it prevents the same page from being loaded twice
        // 2) it enables display of the loading indicator
        this.isLoading = true;
        this.isForce = true;
        this.scroll.Skip = skip;
        this.scroll.Take = limit < 10 ? 10 : limit;

        this.dataTableService.toParent(this.scroll);

        // this.serverResultsService.getResults(this.rows.length, limit).subscribe(results => {
        //    this.rows.push(...results.data);
        //    this.isLoading = false;
        // });
    }

    // on Sort data
    onSort(event:any):void {
        // event was triggered, start sort sequence
        // console.log('Sort Event', event);
        this.isSort = true;
        const sort:any = event.sorts[0];
        this.scroll.Skip = 0;
        this.scroll.Take = this.rows.length;
        this.scroll.SortField = sort.prop;
        this.scroll.SortOrder = sort.dir === "desc" ? -1 : 1;
        // loadData
        // debug here
        // console.log("Scroll here :", this.scroll);
        this.dataTableService.toParent(this.scroll);
    }

    // on Filter data
    onFilter(search: string):void {
        this.isFilter = true;
        this.scroll.Skip = 0;
        this.scroll.Take = 13;
        this.scroll.Filter = search;
        // loadData
        // debug here
        // console.log("Scroll here :", this.scroll);
        this.dataTableService.toParent(this.scroll);
    }

    // on More Codition
    onCondition(event?:any): void {
        // console.log("on Condition :", event);
        if (event) {
            this.isFilter = true;
            this.scroll.Skip = 0;
            this.scroll.Take = 13;
            this.scroll.HasCondition = event.checked;
            this.onlyUser = event.checked;
            // loadData
            // debug here
            // console.log("Scroll here :", this.scroll);
            this.dataTableService.toParent(this.scroll);
        }
    }

    // row class
    getRowClass(row?: any): any {
        if (row) {
            // debug 
            // console.log("On row");

            if (row.OverTimeStatus === 1) {
                return { "is-require": true };
            } else if (row.OverTimeStatus === 2) {
                return { "is-wait": true };
            } else if (row.OverTimeStatus === 3) {
                return { "is-complate": true };
            } else if (row.OverTimeStatus === 4) {
                return { "is-cancel": true };
            } else {
                return { "is-all": true };
            }
        }
    }
}