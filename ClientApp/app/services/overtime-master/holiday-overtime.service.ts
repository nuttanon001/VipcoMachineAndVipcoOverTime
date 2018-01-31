import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
// model
import { HolidayOverTime } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class HolidayOverTimeService extends BaseRestService<HolidayOverTime> {
    constructor(http: Http) {
        super(http, "api/Holiday/");
    }
}

@Injectable()
export class HolidayOverTimeServiceCommunicate extends BaseCommunicateService<HolidayOverTime> {
    constructor() {
        super();
    }
}