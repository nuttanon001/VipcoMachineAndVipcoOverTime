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
        this.iconRegistry.addSvgIcon("machine", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/machine.svg"));
        this.iconRegistry.addSvgIcon("overtime", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/overtime.svg"));
        this.iconRegistry.addSvgIcon("paint", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/paint2.svg"));
        this.iconRegistry.addSvgIcon("maintenance", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/maintenance2.svg"));
        this.iconRegistry.addSvgIcon("qualitycontrol", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/qualitycontrol.svg"));
        this.iconRegistry.addSvgIcon("sage", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/sage-x3.svg"));
        this.iconRegistry.addSvgIcon("safety", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/safety_helmet.svg"));
        this.iconRegistry.addSvgIcon("planning", this.sanitizer.bypassSecurityTrustResourceUrl("/machine/images/planning.svg"));
    }

    onClickOption(option: string): void {
        if (option) {
            if (option.indexOf("paint") !== -1) {
                window.location.href = "http://192.168.2.31/paint/";
            } else if (option.indexOf("maintenance") !== -1) {
                window.location.href = "http://192.168.2.31/maintenance/";
            } else if (option.indexOf("qualitycontrol") !== -1) {
                window.location.href = "http://192.168.2.31/qualitycontrol/";
            } else if (option.indexOf("sage") !== -1) {
                window.location.href = "http://192.168.2.31/extends-sagex3/";
            } else if (option.indexOf("machine") !== -1) {
                window.location.href = "http://192.168.2.31/machinemk2/";
            } else if (option.indexOf("safety") !== -1) {
                window.location.href = "http://192.168.2.31/safety/";
            } else if (option.indexOf("planning") !== -1) {
                window.location.href = "http://192.168.2.31/planning/";
            } else {
                this.SelectApp.emit(option);
            }
        }
    }
}