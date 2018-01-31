import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { Material } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MaterialService extends BaseRestService<Material> {
    constructor(http: Http) {
        super(http, "api/Material/");
    }

    // auto complate
    getAutoComplate():Observable<Array<string>> {
        let url: string = `${this.actionUrl}GetAutoComplate/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }
}
@Injectable()
export class MaterialServiceCommunicate extends BaseCommunicateService<Material> {
    constructor() {
        super();
    }
}