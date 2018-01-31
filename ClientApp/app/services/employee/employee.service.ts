import { Injectable,ViewContainerRef } from "@angular/core";
import { Http } from "@angular/http";
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
// rxjs
import { Observable } from "rxjs/Rx";
// model
import { Employee } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";

@Injectable()
export class EmployeeService extends BaseRestService<Employee> {
    constructor(
        http: Http,
        private dialog: MatDialog
    ) { super(http, "api/Employee/"); }

    // ===================== SubContractor ===========================\\
    // get employee sub contractor
    getEmployeeSubContractor(): Observable<Array<Employee>> {
        let url: string = `${this.actionUrl}SubContractor/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class EmployeeServiceCommunicate extends BaseCommunicateService<Employee> {
    constructor() {
        super();
    }
}