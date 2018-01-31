import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { UnitsMeasure } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class UnitMeasureService extends BaseRestService<UnitsMeasure> {
    constructor(http: Http) {
        super(http, "api/UnitsMeasure/");
    }
}

@Injectable()
export class UnitMeasureServiceCommunicate extends BaseCommunicateService<UnitsMeasure> {
    constructor() {
        super();
    }
}