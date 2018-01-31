import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
// services
import {
    AuthService, DialogsService,
    ValidationService
} from "../../services/service.index";

// classes
import { User } from "../../models/model.index";

@Component({
    templateUrl: "./login.component.html",
    styleUrls: [
        "../../styles/login.style.scss",
        "../../styles/edit.style.scss"
    ],
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    user: User;

    constructor(
        private authService: AuthService,
        private dialogsService: DialogsService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    // init
    ngOnInit(): void {
        this.user = {
            UserId : 0,
            PassWord : "",
            UserName: "",
            LevelUser: 1,
        };
        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.loginForm = this.fb.group({
            UserId: [this.user.UserId],
            UserName: [this.user.UserName,
                [
                    Validators.required,
                    Validators.minLength(1),
                ]
            ],
            PassWord: [this.user.PassWord,
                [
                    Validators.required,
                    Validators.minLength(4),
                ]
            ]
        });
    }

    // login
    onLogin(): void {
        // console.log("On Login");

        this.user = this.loginForm.value;
        this.authService.login(this.user)
            .subscribe((data) => {
                // login successful
                // no more alert Token
                // alert("Our Token is: " + auth.access_token);
                let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : "/home";
                this.router.navigate([redirect]);
            },
            (err) => {
                console.error(err);
                // login failure
                this.dialogsService.error("Login failure", "Warning : Username or Password mismatch !!!", this.viewContainerRef)
            });
    }

    // logout
    logout(): void {
        this.authService.logout();
    }
}