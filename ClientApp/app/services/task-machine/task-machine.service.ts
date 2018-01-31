import { Injectable } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
// model
import { TaskMachine, OptionSchedule, EmployeeGroup, NoTaskMachine, Scroll, ScrollData } from "../../models/model.index";
// base-service
import { BaseRestService, BaseCommunicateService } from "../service.index";
// rx/js
import { Observable } from "rxjs/Observable";

@Injectable()
export class TaskMachineService extends BaseRestService<TaskMachine> {
    constructor(http: Http) {
        super(http, "api/TaskMachine/");
    }

    // get TaskMachine Has OverTime
    getTaskMachineHasOverTime(taskMachineId:number): Observable<any> {
        let url: string = `${this.actionUrl}GetTaskMachineHasOverTime/${taskMachineId}`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // ===================== TaskMachine Schedule ===========================\\
    // get workgroup only has JobCardMaster
    getWorkGroupOnlyHasJobCardMaster(): Observable<Array<EmployeeGroup>> {
        let url: string = `${this.actionUrl}GetWorkGroup/`;
        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get TaskMachine WaitAndProcess
    getTaskMachineWaitAndProcess(option: OptionSchedule): Observable<any> {
        let url: string = `${this.actionUrl}TaskMachineWaitAndProcess/`;
        return this.http.post(url, JSON.stringify(option), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

    // post Check Task Machine Time
    postTaskMachineTime(taskMachine: TaskMachine): Observable<any> {
        let url: string = `${this.actionUrl}CheckMachineTime/`;
        return this.http.post(url, JSON.stringify(taskMachine), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

    // ===================== TaskMachine Report ===========================\\
    // get Task Machine Number
    getTaskMachinePaper(taskMachineId: number): Observable<any> {
        let url: string = this.actionUrl + "GetReportTaskMachine/" + taskMachineId + "/";
        // console.log(url);

        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .map(res => res.blob())
            .catch(this.handleError);
    }

    // get Task Machine Number
    GetTaskMachinePaperOverTime(taskMachineId: number): Observable<any> {
        let url: string = this.actionUrl + "GetReportTaskMachineOverTime/" + taskMachineId + "/";
        // console.log(url);

        return this.http.get(url, { responseType: ResponseContentType.Blob })
            .map(res => res.blob())
            .catch(this.handleError);
    }

    // ===================== NoTaskMachine ================================\\

    // noTaskMachine
    // get all with page
    getAllWithScrollNoTaskMachine(scroll: Scroll, subAction: string = "GetScrollNoTaskMachine/"): Observable<ScrollData<NoTaskMachine>> {
        return this.http.post(this.actionUrl + subAction, JSON.stringify(scroll), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

    // get all NoTaskMachine
    getAllNoTaskMachine(): Observable<Array<NoTaskMachine>> {
        return this.http.get(this.actionUrl + "NoTaskMachine/")
            .map(this.extractData).catch(this.handleError);
    }

    // get NoTaskMachine with key number
    getNoTaskMachineOneKeyNumber(key: number): Observable<NoTaskMachine> {
        return this.http.get(this.actionUrl + "NoTaskMachine/" + key + "/")
            .map(this.extractData).catch(this.handleError);
    }
    // post NoTaskMachine
    postNoTaskMachine(nObject: NoTaskMachine): Observable<NoTaskMachine> {
        return this.http.post(this.actionUrl + "NoTaskMachine/", JSON.stringify(nObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // put NoTaskMachine
    putNoTaskMachineKeyNumber(uObject: NoTaskMachine, key: number): Observable<NoTaskMachine> {
        return this.http.put(this.actionUrl + "NoTaskMachine/" + key + "/", JSON.stringify(uObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

}

@Injectable()
export class TaskMachineServiceCommunicate extends BaseCommunicateService<TaskMachine> {
    constructor() {
        super();
    }
}