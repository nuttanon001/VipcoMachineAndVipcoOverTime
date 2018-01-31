import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 3rd party
import "hammerjs";

// component
import {
    ProjectCenterComponent, ProjectMasterComponent,
    ProjectViewComponent, ProjectDetailEditComponent,
    ProjectEditComponent
} from "../../components/project-master/project.index";
//import { ProjectCenterComponent } from "../../components/project-master/project-center.component";
//import { ProjectMasterComponent } from "../../components/project-master/project-master.component";
// module
import { ProjectRouters } from "./project.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
// services
import {
    //ProjectCodeMasterService,
    //ProjectCodeMasterServiceCommunicate,
    // ProjectCodeDetailService,
    TemplateProjectDetailService,
    DataTableServiceCommunicate
} from "../../services/service.index";
import {
    ProjectCodeMasterService,
    ProjectCodeMasterServiceCommunicate
} from "../../services/projectcode-master/projectcode-master.service";
import { ProjectCodeDetailService } from "../../services/projectcode-detail/projectcode-detail.service";

@NgModule({
    declarations: [
        ProjectCenterComponent,
        ProjectMasterComponent,
        ProjectViewComponent,
        ProjectDetailEditComponent,
        ProjectEditComponent
    ],
    imports: [
        //Angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        //Custom
        CustomMaterialModule,
        ValidationModule,
        ProjectRouters,
    ],
    providers: [
       ProjectCodeMasterService,
       ProjectCodeMasterServiceCommunicate,
       TemplateProjectDetailService,
       // DataTableServiceCommunicate,
    ],
    entryComponents: [
        ProjectDetailEditComponent,
    ],
})

export class ProjectModule { }