import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { Machine } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class MachineService extends BaseRestService<Machine> {
    constructor(http: Http) {
        super(http, "api/Machine/");
    }
}

@Injectable()
export class MachineServiceCommunicate extends BaseCommunicateService<Machine> {
    constructor() {
        super();
    }
}