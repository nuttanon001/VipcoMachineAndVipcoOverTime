// core modules
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
// classes
import { Page,PageData,Scroll,ScrollData } from "../../models/model.index"

export abstract class BaseRestService<Model>{
    constructor(
        protected http: Http,
        protected actionUrl: string) {
    }

    //===================== Privete Members =======================\\
    // extract data
    public extractData(r: Response) { // for extractdata
        let body = r.json();
        // console.log(body);
        return body || {};
    }
    // handle error
    public handleError(error: Response | any) {// for error message
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + err;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    // extract data for result code
    private extractResultCode(res: Response) {
        if (res) {
            if (res.status === 201) {
                return [{ status: res.status, json: res }]
            }
            else if (res.status === 200) {
                return [{ status: res.status, json: res }]
            }
        }
    }
    // get request option
    public getRequestOption(): RequestOptions {   // for request option
        return new RequestOptions({
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
    }
    //===================== HTTP-Rest =============================\\
    // get all
    getAll(): Observable<Array<Model>> {
        return this.http.get(this.actionUrl)
            .map(this.extractData).catch(this.handleError);
    }
    // get one with key number
    getOneKeyNumber(key: number): Observable<Model> {
        return this.http.get(this.actionUrl + key + "/")
            .map(this.extractData).catch(this.handleError);
    }
    // get one with key string
    getOneKeyString(key: string): Observable<Model> {
        return this.http.get(this.actionUrl + key + "/")
            .map(this.extractData).catch(this.handleError);
    }
    // get by master id
    getByMasterId(masterId: number, subAction: string = "GetByMaster/"): Observable<Array<Model>> {
        let url: string = this.actionUrl + subAction + masterId;

        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get by master id
    getByMasterCode(masterCode: string, subAction: string = "GetByMaster/"): Observable<Array<Model>> {
        let url: string = this.actionUrl + subAction + masterCode;

        return this.http.get(url)
            .map(this.extractData).catch(this.handleError);
    }

    // get all with page
    getAllWithScroll(scroll: Scroll, subAction: string = "GetScroll/"): Observable<ScrollData<Model>> {
        return this.http.post(this.actionUrl + subAction, JSON.stringify(scroll), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }

    // get all with page
    //getAllWithPage(page: Page, subAction: string = "GetPage/"): Observable<PageData<Model>> {
    //    return this.http.post(this.actionUrl + subAction, JSON.stringify(page), this.getRequestOption())
    //        .map(this.extractData).catch(this.handleError);
    //}
    // post
    post(nObject: Model): Observable<Model> {
        return this.http.post(this.actionUrl, JSON.stringify(nObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // put with key number
    putKeyNumber(uObject: Model, key: number): Observable<Model> {
        //console.log(uObject);
        return this.http.put(this.actionUrl + key + "/", JSON.stringify(uObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // put with key string
    putKeyString(uObject: Model, key: string): Observable<Model> {
        return this.http.put(this.actionUrl + key + "/", JSON.stringify(uObject), this.getRequestOption())
            .map(this.extractData).catch(this.handleError);
    }
    // delete with key number
    deleteKeyNumber(key: number): Observable<any> {
        return this.http.delete(this.actionUrl + key).map(this.extractData).catch(this.handleError);
    }
}