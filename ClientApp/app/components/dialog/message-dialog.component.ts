// angular
import { Component, OnInit, Inject, } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// model
import { MessageDialog } from "../../models/model.index";

@Component({
    selector: "message-dialog",
    templateUrl: "./message-dialog.component.html",
    styleUrls: ["../../styles/master.style.scss"],
})

// message-dialog component//
export class MessageDialogComponent implements OnInit  {

    // message-dialog ctor //
    constructor(
        public dialogRef: MatDialogRef<MessageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public message: MessageDialog
    ) { }

    ngOnInit(): void {
        if (!this.message) {
            this.onCancelClick();
        }
    }

    // no Click
    onCancelClick(): void {
        this.dialogRef.close();
    }
}