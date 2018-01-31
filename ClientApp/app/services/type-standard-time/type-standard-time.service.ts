import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { TypeStandardTime } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class TypeStandardTimeService extends BaseRestService<TypeStandardTime> {
    constructor(http: Http) {
        super(http, "api/TypeStandardTime/");
    }
}

@Injectable()
export class TypeStandardTimeServiceCommunicate extends BaseCommunicateService<TypeStandardTime> {
    constructor() {
        super();
    }
}