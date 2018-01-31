import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";

import { TaskMachineScheduleComponent } from "../../components/task-machine/task-machine-schedule.component";
import { ParamMap } from "@angular/router";

@Component({
    selector: "task-macine-linkmail",
    templateUrl: "./task-machine-schedule.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
})
// task-macine-linkmail component*/
export class TaskMacineLinkmailComponent extends TaskMachineScheduleComponent {

    /** task-macine-linkmail ctor */

    ngOnInit(): void {
        this.mode = 1;
        if (window.innerWidth >= 1600) {
            this.scrollHeight = 75 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 68 + "vh";
        } else {
            this.scrollHeight = 65 + "vh";
        }
        this.showForm = false;
        this.taskMachines = new Array;

        this.route.paramMap.subscribe((param: ParamMap) => {
            let key: number = Number(param.get("condition") || 0);
            // set locatStorage
            // localStorage.setItem("myapp", JSON.stringify("machine"));
            if (key) {
                this.taskMachineId = key;
                this.buildForm();
                this.getProjectMasterArray();
                this.getTypeMachineArray();

                this.proDetails = new Array;
                this.proDetails.push({ label: "Selected level2/3", value: undefined });
            }
        }, error => console.error(error));
    }

}