import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { ProjectCodeMaster } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class ProjectCodeMasterService extends BaseRestService<ProjectCodeMaster> {
    constructor(http: Http) {
        super(http, "api/ProjectCodeMaster/");
    }
}

@Injectable()
export class ProjectCodeMasterServiceCommunicate extends BaseCommunicateService<ProjectCodeMaster> {
    constructor() {
        super();
    }
}