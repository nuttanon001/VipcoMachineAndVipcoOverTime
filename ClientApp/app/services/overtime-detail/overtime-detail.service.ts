import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
// model
import { OverTimeDetail } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class OverTimeDetailService extends BaseRestService<OverTimeDetail> {
    constructor(http: Http) {
        super(http, "api/OverTimeDetail/");
    }
}