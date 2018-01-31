import {
  Component, OnInit,
  Output, EventEmitter, ElementRef
} from "@angular/core";

// by importing just the rxjs operators we need, We're theoretically able
// to reduce our build size vs. importing all of them.
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switch";

// import { YouTubeSearchService } from './you-tube-search.service';
// import { SearchResult } from './search-result.model';

@Component({
  selector: "search-box",
  template: `
    <mat-input-container floatPlaceholder="never">
        <input type="text" matInput placeholder="Search here..." autofocus>
    </mat-input-container>
  `
  // <input type="text" class="form-control" placeholder="Search" autofocus>
})
export class SearchBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // convert the `keyup` event into an observable stream
    Observable.fromEvent(this.el.nativeElement, "keyup")
      .map((e: any) => e.target.value) // extract the value of the input
         // .filter((text: string) => text.length > 1) // filter out if empty
        .distinctUntilChanged()                    // not same value
        .debounceTime(250)                         // only once every 250ms
        .subscribe(
        (results: any) => { // on sucesss
            // debug here
            // console.log("Results : ", results);
            this.search.emit(results);
        });
  }
}
