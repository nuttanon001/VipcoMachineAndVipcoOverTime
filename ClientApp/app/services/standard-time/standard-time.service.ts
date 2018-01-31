import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { StandardTime,PlanViewModel } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StandardTimeService extends BaseRestService<StandardTime> {
    constructor(http: Http) {
        super(http, "api/StandardTime/");
    }

    // get job card master with MultiKey
    postStanadardTimePlan(planStandardTime: PlanViewModel): Observable<PlanViewModel> {
        let url: string = `${this.actionUrl}GetTotalStandardTime/`;
        return this.http.post(url, planStandardTime).map(this.extractData).catch(this.handleError);
    }
}