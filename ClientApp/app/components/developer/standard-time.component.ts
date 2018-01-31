import { Component, OnInit } from "@angular/core";

@Component({
    selector: "standard-time",
    templateUrl: "./standard-time.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
/** standard-time component*/
export class StandardTimeComponent implements OnInit
{
    typeValues =
    [
        "PerHours",
        "PerDays"
    ];

    typeStds = [
        "Tube sheet",
        "End tube sheet plate",
        "Gusset plate/ Stiffener plate",
        "FB.Plate",
        "Built up Plate"
    ];

    materials = [
        "ASTM-304H|C100X50X5X7X6000mm",
        "ASTM-A36|C100X50X5X7X6000mm",
        "ASTM-A516|C100X50X5X7X6000mm",
        "ASTM-SA387|H200X100X5.5X8X12000mm",
        "ASTM-SA516|H200X200X8X12X12000mm",
        "ASTM-SA572|Pipe8\" SCH60X10000mm",
        "JIS G3101-304H|H200X100X5.5X8X12000mm",
        "JIS G3101-SS400|H200X200X8X12X12000mm",
        "JIS G3101-SUS304H|C200X90X8X13X6000mm",
        "JIS G3101-SUS304|C200X90X8X13X6000mm",
    ];

    /** standard-time ctor */
    constructor() { }

    /** Called by Angular after standard-time component initialized */
    ngOnInit(): void { }
}