import { Component } from "@angular/core";

@Component({
    selector: "home",
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    onOpenNewLink(): void {
        let local = localStorage.getItem("document");
        if (local) {
            let link: string = JSON.parse(local);
            if (link) {
                window.open(link, "_blank");
            }
        }
    }
}
