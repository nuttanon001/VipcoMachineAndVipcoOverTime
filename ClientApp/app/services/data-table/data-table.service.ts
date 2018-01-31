import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
// model
import { PageData,Page,Scroll,ScrollData } from "../../models/model.index";

@Injectable()
export class DataTableServiceCommunicate<Model> {
    // Observable string sources
    private ParentSource = new Subject<Scroll>();
    private ChileSource = new Subject<ScrollData<Model>>();
    private ReloadSource = new Subject<boolean>();

    // Observable string streams
    ToParent$ = this.ParentSource.asObservable();
    toChild$ = this.ChileSource.asObservable();
    ToReload$ = this.ReloadSource.asObservable();

    // Service message commands
    toParent(scroll: Scroll): void {
        this.ParentSource.next(scroll);
    }

    toChild(scrollData: ScrollData<Model>): void {
        this.ChileSource.next(scrollData);
    }

    toReload(reload: boolean): void {
        this.ReloadSource.next(reload);
    }
}