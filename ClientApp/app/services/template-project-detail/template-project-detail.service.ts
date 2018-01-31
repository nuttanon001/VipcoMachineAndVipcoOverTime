import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { TemplateProjectDetail } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService, } from "../service.index";

@Injectable()
export class TemplateProjectDetailService extends BaseRestService<TemplateProjectDetail> {
    constructor(http: Http) {
        super(http, "api/TemplateProjectDetail/");
    }
}

@Injectable()
export class TemplateProjectDetailServiceCommunicate extends BaseCommunicateService<TemplateProjectDetail> {
    constructor() {
        super();
    }
}