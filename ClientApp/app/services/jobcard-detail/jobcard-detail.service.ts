﻿import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { JobCardDetail, OptionSchedule } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JobCardDetailService extends BaseRestService<JobCardDetail> {
    constructor(http: Http) {
        super(http, "api/JobCardDetail/");
    }

    // get check jobcard can cancel
    getChangeStandardTime(JobCardDetailId: number, StandardId: number, Create: string): Observable<JobCardDetail> {
        let url: string = `${this.actionUrl}ChangeStandardTime/${JobCardDetailId}/${StandardId}/${Create}/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    // ===================== Require JobCard Detail Schedule ===========================\\
    // post Require JobCard-Detal Schedule
    postRequireJobCardRequireSchedule(option: OptionSchedule): Observable<any> {
        let url: string = `${this.actionUrl}RequireJobCardDetalSchedule/`;
        return this.http.post(url, JSON.stringify(option), this.getRequestOption())
                   .map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class JobCardDetailServiceServiceCommunicate extends BaseCommunicateService<JobCardDetailService> {
    constructor() {
        super();
    }
}