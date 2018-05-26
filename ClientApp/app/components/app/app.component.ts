import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Route, Router, NavigationEnd } from "@angular/router";
// service
import { AuthService } from "../../services/service.index";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["../../styles/app.style.scss"],
    encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit {

    option: string;
    currentUrl: string;
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    // called by Angular after main-screen component initialized */
    ngOnInit(): void {
        this.option = "";
        // reset login status
        this.authService.logout();

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // console.log(event.url);
                this.currentUrl = event.url;
                if (this.currentUrl.indexOf("link-mail") !== -1) {
                    this.option = "machine";
                }
            }
        });
    }

    SelectApp(option?: string): void {
        if (option) {
            // console.log("Option is:" , option);
            this.option = option;
            let documentAddress: string;
            if (this.option === "machine") {
                documentAddress = "files/machine_doc.pdf";
            } else {
                documentAddress = "files/overtime_doc.pdf";
            }
            // set locatStorage
            localStorage.setItem("document", JSON.stringify(documentAddress));
        }
    }
}
