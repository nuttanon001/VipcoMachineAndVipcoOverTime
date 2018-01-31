import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// model
import { User } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService extends BaseRestService<User> {
    constructor(http: Http) {
        super(http, "api/User/");
    }

    // EmployeeAlready
    // get check employee already username
    getEmployeeAlready(empCode: string): Observable<any> {
        let url: string = `${this.actionUrl}EmployeeAlready/${empCode}`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }
}