import { Component, OnInit, Pipe } from "@angular/core";
import {
    FormBuilder, FormGroup,
    FormControl, Validators
} from "@angular/forms";

import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector:"developer-master",
    templateUrl: "./developer-master.component.html",
    styleUrls: ["../../styles/master.style.scss"],
})

export class DeveloperMasterComponent implements OnInit {

    rows: Array<RowData>;
    myPipe: DateOnlyPipe = new DateOnlyPipe("it");
    columns = [
        { prop: "MyName", name: "NameComponent", width:200 },
        { prop: "MyValue", name: "Value", width: 150 },
        { prop: "Date", name: "Date", width: 100, pipe: this.myPipe }
    ];
    row: RowData;
    hideleft: boolean;

    constructor() { }

    ngOnInit(): void {
        let date1: Date = new Date;

        this.rows = [
            { MyName: "MachineComponent", MyValue: "developer-machine", Date: date1 },
            { MyName: "MachineWorkComponent", MyValue: "developer-jobcard", Date: date1 },
            { MyName: "TypeMachineComponent", MyValue: "developer-machine-type", Date: date1 },
            { MyName: "MaterialComponent", MyValue: "material", Date: date1 },
            { MyName: "JobMaster", MyValue: "projectcode", Date: date1 },
            { MyName: "StandardTime", MyValue: "standard-time", Date: date1 },
            { MyName: "TaskMachine", MyValue: "task-machine", Date: date1},

        ];
        this.row = { MyName: "", MyValue: "", Date: date1 };
        this.hideleft = true;
    }

    onBackWard(): void {
        this.hideleft = !this.hideleft;
    }

    onSelect(selected:any) {
        //console.log('Select Event', selected);
        //console.log('Json Event' + JSON.stringify(selected));
        this.row = selected.selected[0];
        //console.log('Row ', this.row);
        //this.hideleft = !this.hideleft;
        this.hideleft = !this.hideleft;
    }

    onActivate(event:any) {
        console.log('Activate Event', event);
    }

    Test() {
        console.log("Test");
        this.hideleft = !this.hideleft;
    }
}

export class RowData {
    MyName: string;
    MyValue: string;
    Date: Date;
}

//@Pipe({
//    name: 'dateOnly'
//})
//export class DateOnlyPipe extends DatePipe {
//    public transform(value:any): any {
//        return super.transform(value, 'dd/MM/y');
//    }
//}