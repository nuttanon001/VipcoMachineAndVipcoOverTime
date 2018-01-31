import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { ClassificationMaterial } from "../../models/model.index";
// base-service
import { BaseRestService,BaseCommunicateService, } from "../service.index";

@Injectable()
export class ClassificationMaterialService extends BaseRestService<ClassificationMaterial> {
    constructor(http: Http) {
        super(http, "api/Classification/");
    }
}

@Injectable()
export class ClassificationMaterialServiceCommunicate extends BaseCommunicateService<ClassificationMaterial> {
    constructor() {
        super();
    }
}