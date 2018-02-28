import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "hammerjs";

// component
import { JobCardCenterComponent } from "../../components/jobcard/jobcard-center.component";
import { JobCardMasterComponent } from "../../components/jobcard/jobcard-master.component";
import { JobCardViewComponent } from "../../components/jobcard/jobcard-view.component";
import { JobCardEditComponent } from "../../components/jobcard/jobcard-edit.component";
import { JobCardWaitingComponent } from "../../components/jobcard/jobcard-waiting.component";
import { JobcardDetailEditComponent } from "../../components/jobcard/jobcard-detail-edit.component";
import { RequireJobCardDetailScheduleComponent } from "../../components/jobcard/require-jobcard-detail-schedule.component";
// module
import { JobCardRouters } from "./jobcard.routing";
import {
    CustomMaterialModule, ValidationModule,
} from "../module.index";
import {
    JobCardMasterService, JobCardDetailService,
    JobCardMasterServiceCommunicate, DataTableServiceCommunicate
} from "../../services/service.index";

@NgModule({
    declarations: [
        JobCardCenterComponent,
        JobCardMasterComponent,
        JobCardViewComponent,
        JobCardEditComponent,
        JobCardWaitingComponent,
        JobcardDetailEditComponent,
        RequireJobCardDetailScheduleComponent
    ],
    imports: [
        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // custom
        CustomMaterialModule,
        ValidationModule,
        JobCardRouters,
    ],
    exports: [
        JobCardViewComponent,
    ],
    providers: [
        JobCardMasterService,
        JobCardDetailService,
        JobCardMasterServiceCommunicate,
        // dataTableServiceCommunicate
    ]
})

export class JobCardModule { }