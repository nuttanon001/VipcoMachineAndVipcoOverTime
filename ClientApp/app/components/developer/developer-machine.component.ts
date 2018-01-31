import { Component } from "@angular/core";

@Component({
    selector: "developer-machine",
    templateUrl: "./developer-machine.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})

export class DeveloperMachineComponent {
    machineStatuses = [
        { value: 'Ready' },
        { value: 'Repair' },
        { value: 'Failure' }
    ];

    typeMachines = [
        { value: "Drill" },
        { value: "Cutter" },
        { value: "Lathe" },
        { value: "Radial" },
    ];

    constructor() {};
}