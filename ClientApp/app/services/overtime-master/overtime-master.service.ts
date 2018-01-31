import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
// model
import {
    OverTimeMaster, OptionOverTimeSchedule,
    ReportOverTimeSummary, OptionOverTimeLast,
    OptionOverTimeChart
} from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class OverTimeMasterService extends BaseRestService<OverTimeMaster> {
    constructor(http: Http) {
        super(http, "api/OverTimeMaster/");
    }

    // post Insert OverTimeMaster V2
    postV2(nObject: OverTimeMaster): Observable<any> {
        return this.http.post(this.actionUrl+"V2/", JSON.stringify(nObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // put with key number
    putKeyNumber(uObject: OverTimeMaster, key: number): Observable<any> {
        // console.log(uObject);
        return this.http.put(this.actionUrl + key + "/", JSON.stringify(uObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // get last OverTimeMaster
    getLastOverTimeMaster(LastOverTimeMasterId: number, GroupCode: string, CurrentId:number): Observable<OverTimeMaster> {
        let url: string = `${this.actionUrl}GetLastOverTime/${LastOverTimeMasterId}/${GroupCode}/${CurrentId}`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }
    // get last OverTimeMaster V2
    getlastOverTimeMasterV2(Option: OptionOverTimeLast): Observable<OverTimeMaster> {
        let url: string = `${this.actionUrl}GetLastOverTimeV2/`;
        return this.http.post(url, JSON.stringify(Option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // get last OverTimeMaster V3
    getlastOverTimeMasterV3(Option: OptionOverTimeLast): Observable<OverTimeMaster> {
        let url: string = `${this.actionUrl}GetLastOverTimeV3/`;
        return this.http.post(url, JSON.stringify(Option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // get change status
    getChangeStatus(OverTimeMasterId: number): Observable<OverTimeMaster> {
        let url: string = `${this.actionUrl}ChangeStatus/${OverTimeMasterId}`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    // put with key number
    putUpdateStatus(uObject: OverTimeMaster, key: number): Observable<OverTimeMaster> {
        // console.log(uObject);
        return this.http.put(this.actionUrl+"UpdateStatus/" + key + "/", JSON.stringify(uObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // ===================== OverTime Chart ==============================\\
    // get overtime chart data
    postOverTimeChartData(option: OptionOverTimeChart): Observable<any> {
        return this.http.post(`${this.actionUrl}PostOverTimeChartData`, JSON.stringify(option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // ===================== OverTime Schedule ===========================\\
    // get OverTime Schedule
    getOverTimeMasterSchedule(option: OptionOverTimeSchedule): Observable<any> {
        let url: string = `${this.actionUrl}OverTimeSchedule/`;
        return this.http.post(url, JSON.stringify(option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

    // ===================== OverTime Report =============================\\

    // get report over-time to pdf #1
    getReportOverTimePdf(OverTimeMasterId: number): Observable<any> {
        let url: string = `${this.actionUrl}GetReportOverTimePdf/${OverTimeMasterId}/`;
        return this.http.get(url, { responseType: ResponseContentType.Blob })
                .map(res => res.blob())
                .catch(this.handleError);
    }

    // get report over-time to pdf #2
    getReportOverTimePdf2(OverTimeMasterId: number): Observable<any> {
        let url: string = `${this.actionUrl}GetReportOverTimePdf2/${OverTimeMasterId}/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    // get report over-time summary
    getReportOverTimeSummary(option: OptionOverTimeSchedule): Observable<any> {
        console.log(option);

        let url: string = `${this.actionUrl}GetReportSummary/`;
        return this.http.post(url, JSON.stringify(option), this.getRequestOption())
                .map(this.extractData).catch(this.handleError);
    }
}

@Injectable()
export class OverTimeMasterServiceCommunicate extends BaseCommunicateService<OverTimeMaster> {
    constructor() {
        super();
    }
}