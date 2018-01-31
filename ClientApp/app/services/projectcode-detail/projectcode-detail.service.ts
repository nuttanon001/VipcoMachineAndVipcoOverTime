import { Injectable, ViewContainerRef } from "@angular/core";
import { Http } from "@angular/http";
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
// rxjs
import { Observable } from "rxjs/Rx";
// component
import { ProjectDetailEditComponent } from "../../components/project-master/project.index";
// model
import { ProjectCodeDetail } from "../../models/model.index";
// base-service
import { BaseRestService } from "../service.index";

@Injectable()
export class ProjectCodeDetailService extends BaseRestService<ProjectCodeDetail> {
    constructor(
        http: Http,
        private dialog: MatDialog
    ) {
        super(http, "api/ProjectCodeDetail/");
    }

    // get auto complate project detail
    getAutoComplateProjectDetailCode(): Observable<Array<string>> {
        let url: string = `${this.actionUrl}GetAutoComplate/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    // get can delete project detail
    getCanDeleteProjectDetail(ProjectDetailId: number): Observable<any> {
        let url: string = `${this.actionUrl}CanDelete/${ProjectDetailId}/`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    public dialogProjectDetail(detail: ProjectCodeDetail, viewContainerRef: ViewContainerRef): Observable<ProjectCodeDetail> {
        let dialogRef: MatDialogRef<ProjectDetailEditComponent>;
        let config = new MatDialogConfig();

        // config
        config.viewContainerRef = viewContainerRef;
        config.data = detail;
        config.height = "450px";
        config.width = "700px";

        // open dialog
        dialogRef = this.dialog.open(ProjectDetailEditComponent,config);
        return dialogRef.afterClosed();
    }
}