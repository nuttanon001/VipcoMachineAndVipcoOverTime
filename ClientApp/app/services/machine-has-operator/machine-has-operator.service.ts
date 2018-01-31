import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { MachineHasOperator } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class MachineHasOperatorService extends BaseRestService<MachineHasOperator> {
    constructor(http: Http) {
        super(http, "api/Operator/");
    }
}

@Injectable()
export class MachineHasOperatorServiceCommunicate extends BaseCommunicateService<MachineHasOperator> {
    constructor() {
        super();
    }
}