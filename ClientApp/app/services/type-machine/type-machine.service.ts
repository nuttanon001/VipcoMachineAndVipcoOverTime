import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { TypeMachine } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class TypeMachineService extends BaseRestService<TypeMachine> {
    constructor(http: Http) {
        super(http, "api/TypeMachine/");
    }
}

@Injectable()
export class TypeMachineServiceCommunicate extends BaseCommunicateService<TypeMachine> {
    constructor() {
        super();
    }
}