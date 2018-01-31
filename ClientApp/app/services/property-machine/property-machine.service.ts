import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { PropertyMachine } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class PropertyMachineService extends BaseRestService<PropertyMachine> {
    constructor(http: Http) {
        super(http, "api/PropertyMachine/");
    }
}

@Injectable()
export class PropertyMachineServiceCommunicate extends BaseCommunicateService<PropertyMachine> {
    constructor() {
        super();
    }
}