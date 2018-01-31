import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'material',
    templateUrl: './material.component.html',
    styleUrls: ["../../styles/edit.style.scss"],
})
/** material component*/
export class MaterialComponent implements OnInit
{
    classMate= [
        "AISI",
        "ASTM",
        "JIS",
        "JIS G3101",
        "DIN"
    ];

    gradeMate= [
        "304H",
        "A36",
        "A516",
        "A572",
        "SA387",
        "SA516",
        "SA572",
        "SS400",
        "SUS304",
        "SUS304H"
    ]

    /** material ctor */
    constructor() { }

    /** Called by Angular after material component initialized */
    ngOnInit(): void { }
}