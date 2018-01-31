import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// componentes
import { DeveloperCenterComponent,DeveloperMasterComponent } from "../../components/developer/developer.index";

const educationRoutes: Routes = [
    {
        path: "developer",
        component: DeveloperCenterComponent,
        children: [
            {
                path: "",
                component: DeveloperMasterComponent,
            }
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(educationRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class DeveloperRouters { }