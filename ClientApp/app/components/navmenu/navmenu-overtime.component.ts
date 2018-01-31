import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatMenuTrigger } from "@angular/material";
// service
// unmark this if AuthService complete
import { AuthService } from "../../services/service.index";
// model
import { User } from "../../models/model.index";

@Component({
    selector: "navmenu-overtime",
    templateUrl: "./navmenu-overtime.component.html",
    styleUrls: ["../../styles/navmenu.style.scss"],
})
/** navmenu-overtime component*/
export class NavMenuOvertimeComponent implements OnInit
{
    @ViewChild("mainMenu") mainMenu: MatMenuTrigger;
    @ViewChild("subMenu") subMenu: MatMenuTrigger;

    constructor(
        // unmark this if AuthService complete
        private authService: AuthService,
        private router: Router
    ) { }

    // propertires
    // =============================================\\
    get GetLevel3(): boolean {
        if (this.authService.getAuth) {
            return (this.authService.getAuth.LevelUser || 0) > 3;
        } else {
            return false;
        }
    }

    get GetLevel2(): boolean {
        if (this.authService.getAuth) {
            return (this.authService.getAuth.LevelUser || 0) > 1;
        } else {
            return false;
        }
    }

    get GetLevel1(): boolean {
        if (this.authService.getAuth) {
            return (this.authService.getAuth.LevelUser || 0) > 0;
        } else {
            return false;
        }
    }

    ngOnInit(): void {
        // reset login status
        this.authService.logout();
    }

    get showLogin(): boolean {
        // return false;
        // unmark this if AuthService complete
        if (this.authService) {
            if (this.authService.isLoggedIn) {
                return !this.authService.isLoggedIn;
            }
        }
        return true;
    }

    get userName(): string {
        if (this.authService.getAuth) {
            if (this.authService.getAuth.NameThai) {
                return " " + this.authService.getAuth.NameThai + " ";
            }
        }
        return "";
    }

    // on menu close
    // =============================================\\
    menuOnCloseMenu1(): void {
        if (this.subMenu) {
            this.subMenu.closeMenu();
        }
    }

    menuOnCloseMenu2(): void {
        this.mainMenu.closeMenu();
    }

    // =============================================\\
    // on menu open
    // =============================================\\
    menuOnOpenMenu1(): void {
        this.mainMenu.openMenu();
    }

    menuOnOpenMenu2(): void {
        if (this.subMenu) {
            this.subMenu.openMenu();
        }
    }
    // =============================================\\
    onLogOut(): void {
        this.authService.logout();
        this.router.navigate(["login"]);
    }
}