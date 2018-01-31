import {
    Component, OnInit,
    Output, EventEmitter, ElementRef
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material";
@Component({
    selector: "main-screen",
    templateUrl: "./main-screen.component.html",
    styleUrls: ["../../styles/master.style.scss"],
})
// main-screen component*/
export class MainScreenComponent implements OnInit {
    @Output() SelectApp: EventEmitter<string> = new EventEmitter<string>();
    // main-screen ctor */
    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) { }

    // called by Angular after main-screen component initialized */
    ngOnInit(): void {
        this.iconRegistry.addSvgIcon("machine", this.sanitizer.bypassSecurityTrustResourceUrl("/images/machine.svg"));
        this.iconRegistry.addSvgIcon("overtime", this.sanitizer.bypassSecurityTrustResourceUrl("/images/overtime.svg"));
        this.iconRegistry.addSvgIcon("paint", this.sanitizer.bypassSecurityTrustResourceUrl("/images/paint.svg"));
    }

    onClickOption(option: string): void {
        if (option) {
            if (option.indexOf("paint") !== -1) {
                window.location.href = "http://192.168.2.31:8009";
            } else {
                this.SelectApp.emit(option);
            }
        }
    }


}