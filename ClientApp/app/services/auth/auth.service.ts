import { Injectable } from "@angular/core";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';
// model
import { User } from "../../models/model.index";

@Injectable()
export class AuthService {
    userName: string;
    authKey = "auth";
    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private http: Http) { }

    login(user:User): Observable<any> {

        return this.http.post("api/User/Login", user
            , new RequestOptions({
                headers: new Headers({
                    // for urlencoded
                    //  "Content-Type": "application/x-www-form-urlencoded"
                    "Content-Type": "application/json"
                })
            }))
            .map((response: Response) => {
                let auth = response.json();
                // console.log(auth);
                this.setAuth = auth;
                this.userName = auth.UserName; //data.UserName;
                return auth;
            });
    }

    logout(): boolean {
        this.setAuth = null;
        this.userName = "";
        return false;
    }

    // Converts a Json object to urlencoded format
    toUrlEncodedString(data: any) {
        let body = "";
        for (let key in data) {
            if (body.length) {
                body += "&";
            }
            body += key + "=";
            body += encodeURIComponent(data[key]);
        }
        return body;
    }
    // Persist auth into localStorage or removes it if a NULL argument is given
    set setAuth(auth: any) {
        if (auth) {
            localStorage.setItem(this.authKey, JSON.stringify(auth));
        }
        else {
            localStorage.removeItem(this.authKey);
        }
    }
    // Retrieves the auth JSON object (or NULL if none)
    get getAuth(): User | undefined {
        let i = localStorage.getItem(this.authKey);
        if (i) {
            return JSON.parse(i);
        }
        else {
            return undefined;
        }
    }

    //get getUser(): User {
    //    let user = localStorage.getItem("userData");
    //    if (user)
    //        return JSON.parse(user);
    //    else
    //        return null;
    //}

    get isLoggedIn(): boolean {
        if (this.getAuth) {
            return true;
        }
        else
            return false;
    }
}