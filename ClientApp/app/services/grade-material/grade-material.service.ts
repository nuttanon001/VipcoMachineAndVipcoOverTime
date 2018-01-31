import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { GradeMaterial } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class GradeMaterialService extends BaseRestService<GradeMaterial> {
    constructor(http: Http) {
        super(http, "api/GradeMaterial/");
    }
}