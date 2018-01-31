import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
// model
import { CuttingPlan ,CuttingImport} from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService, } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class CuttingPlanService extends BaseRestService<CuttingPlan> {
    constructor(http: Http) {
        super(http, "api/CuttingPlan/");
    }

    // get Check cutting planing
    getCheckCuttingPlaning(): Observable<any> {
        let url: string = `${this.actionUrl}CheckCuttingPlan/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    // get can delete cutting planing
    getCanDeleteCuttingPlaning(CuttingPlanId: number): Observable<any> {
        let url: string = `${this.actionUrl}CanDelete/${CuttingPlanId}`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    // import Csv file
    postImportCsv(imports: Array<CuttingImport>): Observable<any> {
        let CreateBy: string = "Someone";// this.authService.userName || "Someone";
        let url: string = `${this.actionUrl}ImportData/${CreateBy}`;
        return this.http.post(url, JSON.stringify(imports), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class CuttingPlanServiceCommunicate extends BaseCommunicateService<CuttingPlan> {
    constructor() {
        super();
    }
}