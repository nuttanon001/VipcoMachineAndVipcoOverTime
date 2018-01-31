import { Injectable, ViewContainerRef } from "@angular/core";
import { Http } from "@angular/http";
// rxjs
import { Observable } from "rxjs/Rx";
// model
import { EmployeeGroup } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class EmployeeGroupService extends BaseRestService<EmployeeGroup> {
    constructor(http: Http) {
        super(http, "api/EmployeeGroup/");
    }
}