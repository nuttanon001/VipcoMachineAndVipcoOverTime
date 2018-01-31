import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
// model
import { TaskMachineHasOverTime } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class TaskMachineHasOverTimeService extends BaseRestService<TaskMachineHasOverTime> {
    constructor(http: Http) {
        super(http, "api/OverTime/");
    }
}