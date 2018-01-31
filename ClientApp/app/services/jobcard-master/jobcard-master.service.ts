import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
// model
import { JobCardMaster, AttachFile } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
import { Observable } from "rxjs/Observable";

@Injectable()
export class JobCardMasterService extends BaseRestService<JobCardMaster> {
    constructor(http: Http) {
        super(http, "api/JobCardMaster/");
    }

    // ===================== JobCard Waiting ===========================\\

    // get job card master with MultiKey
    postGetMultiKey(listKey: Array<string>): Observable<Array<JobCardMaster>> {
        let url: string = `${this.actionUrl}GetMultiKey/`;
        return this.http.post(url, listKey).map(this.extractData).catch(this.handleError);
    }

    // get check jobcard can cancel
    getCheckJobCardCanCancel(JobCardMasterId: number): Observable<any> {
        let url: string = `${this.actionUrl}JobCardCanCancel/${JobCardMasterId}`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get set Cutting Plan to JobCardDetail
    getCuttingPlanToJobCardDetail(jobCardMasterId: number): Observable<any> {
        let url: string = `${this.actionUrl}GetCuttingPlanToJobCardDetail/${jobCardMasterId}`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get check jobcard can complate
    getCheckJobCardCanComplate(JobCardMasterId: number): Observable<any> {
        let url: string = `${this.actionUrl}JobCardCanComplate/${JobCardMasterId}`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get cancel jobcard
    getChangeStatusJobCardMaster(JobCardMasterId: number,status:number): Observable<JobCardMaster> {
        let url: string = `${this.actionUrl}JobCardChangeStatus/${JobCardMasterId}/${status}`;

        console.log("url: " ,url);
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get waiting jobcard
    getJobCardHasWait(): Observable<any> {
        let url: string = `${this.actionUrl}JobCardHasWait/`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // ===================== Upload File ===============================\\
    // get file
    getAttachFile(JobCardMasterId: number): Observable<Array<AttachFile>> {
        let url: string = `${this.actionUrl}GetAttach/${JobCardMasterId}/`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }


    // upload file
    postAttactFile(JobCardMasterId: number, files: FileList): Observable<any> {
        let input:any = new FormData();

        for (let i:number = 0; i < files.length; i++) {
            if (files[i].size <= 5242880) {
                input.append("files", files[i]);
            }
        }

        // console.log("Files : ", input);

        let CreateBy: string = "Someone";// this.authService.userName || "Someone";
        let url: string = `${this.actionUrl}PostAttach/${JobCardMasterId}/${CreateBy}`;
        return this.http.post(url, input).map(this.extractData).catch(this.handleError);
    }

    // delete file
    deleteAttactFile(AttachId: number): Observable<any> {
        let url: string = this.actionUrl + "DeleteAttach/" + AttachId;
        return this.http.delete(url).catch(this.handleError);
    }

    // ===================== End Upload File ===========================\\
    // ===================== Start Download File ===========================\\

    getDownloadFilePaper(path:string): Observable<any> {
        let url: string = path + "/";
        // console.log(url);

        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .map(res => res.blob())
            .catch(this.handleError);
    }
}

@Injectable()
export class JobCardMasterServiceCommunicate extends BaseCommunicateService<JobCardMaster> {
    constructor() {
        super();
    }
}