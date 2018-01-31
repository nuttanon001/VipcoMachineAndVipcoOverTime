import { Injectable, ViewContainerRef } from "@angular/core";
import { Http } from "@angular/http";
// rxjs
import { Observable } from "rxjs/Rx";
// model
import { EmployeeGroupMis } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class EmployeeGroupMisService extends BaseRestService<EmployeeGroupMis> {
    constructor(http: Http) {
        super(http, "api/EmployeeGroupMis/");
    }
}