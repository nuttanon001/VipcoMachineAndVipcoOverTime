import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
// rxjs
import { Observable } from "rxjs/Rx";
// model
import { ProjectCodeDetail } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class ProjectCodeDetailEditService extends BaseRestService<ProjectCodeDetail> {
    constructor(http: Http,) {
        super(http, "api/ProjectCodeDetail/");
    }

    // get can delete project detail
    getCanDeleteProjectDetail(ProjectDetailId: number): Observable<any> {
        let url: string = `${this.actionUrl}CanDelete/${ProjectDetailId}/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }
}