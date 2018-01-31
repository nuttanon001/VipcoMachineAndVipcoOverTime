// angular
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
// model
import { User } from "../../models/model.index";
// service
import { DialogsService, UserService } from "../../services/service.index";
import { EmployeeService } from "../../services/employee/employee.service";
import { AuthService } from "../../services/auth/auth.service";
// timezone
import * as moment from "moment-timezone";

@Component({
    selector: "register",
    templateUrl: "./register.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
    providers: [UserService,EmployeeService]
})
// register component*/
export class RegisterComponent implements OnInit {
    user: User;
    userForm: FormGroup;
    empCode: string = "";
    userName: string = "";

    get UpdateProfile(): boolean {
        if (this.user) {
            return this.user.UserId > 0;
        }
        return false;
    }
    // register ctor */
    constructor(
        private service: UserService,
        private serviceEmployee: EmployeeService,
        private serviceDialogs: DialogsService,
        private serviceAuth: AuthService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,

    ) { }

    /** Called by Angular after register component initialized */
    ngOnInit(): void {
        this.user = {
            UserId: 0,
            LevelUser: 1,
        };

        this.buildForm();

        this.route.paramMap.subscribe((param: ParamMap) => {
            let key: number = Number(param.get("condition") || 0);

            // debug here
            console.log("Route key is :", key);

            if (key) {
                if (this.serviceAuth.getAuth) {
                    this.user = this.serviceAuth.getAuth;

                    // debug here
                    console.log("getAuth is :", JSON.stringify(this.user));
                    this.buildForm();
                } else {
                    this.onGoBack();
                }
            }
        }, error => console.error(error));
    }

    // build form
    buildForm(): void {
        this.userForm = this.fb.group({
            UserId: [this.user.UserId],
            UserName: [this.user.UserName,
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(50),
                ]
            ],
            PassWord: [this.user.PassWord,
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(20)
                ]
            ],
            MailAddress: [this.user.MailAddress,
                [
                    Validators.maxLength(200),
                ]
            ],
            LevelUser: [this.user.LevelUser],
            EmpCode: [this.user.EmpCode,
                [
                    Validators.required,
                ]
            ],
            Creator: [this.user.Creator],
            CreateDate: [this.user.CreateDate],
            Modifyer: [this.user.Modifyer],
            ModifyDate: [this.user.ModifyDate],
            // viewModel
            NameThai: [this.user.NameThai,
                [
                    Validators.required,
                ]
            ],
        });

        const control: AbstractControl | null = this.userForm.get("EmpCode");
        if (control) {
            control.valueChanges.subscribe((data: any) => this.onUpdateEmployee());
        }
    }

    // update PlanDate
    onUpdateEmployee(): void {
        if (!this.userForm || !this.user) { return; }

        const form:FormGroup = this.userForm;
        const control: AbstractControl | null = form.get("EmpCode");
        // if have planned start date
        if (control) {
            // beark loop
            if (this.empCode) {
                if (this.empCode === control.value) {
                    return;
                }
            }

            // console.log("Loop");

            this.serviceEmployee.getOneKeyString(control.value)
                .subscribe(employee => {
                    this.service.getEmployeeAlready(employee.EmpCode)
                        .subscribe(data => {
                            this.userForm.patchValue({
                                NameThai: employee.NameThai,
                            });
                        }, error => {
                            let message:any = error.replace("404 - Not Found", "");
                            this.serviceDialogs.error("Reguester Error", (message || ""), this.viewContainerRef);
                            this.userForm.patchValue({
                                NameThai: "",
                            });
                        });
                }, error => {
                    this.userForm.patchValue({
                        NameThai: "",
                    });
                    console.error(error);
                });
        }
    }

    // on valid data
    onSubmit(): void {
        if (this.userForm) {
            this.user = this.userForm.value;
            // update TimeZone
            let zone:string = "Asia/Bangkok";
            if (this.user) {
                if (this.user.CreateDate !== null) {
                    this.user.CreateDate = moment.tz(this.user.CreateDate, zone).toDate();
                }
                if (this.user.ModifyDate !== null) {
                    this.user.ModifyDate = moment.tz(this.user.ModifyDate, zone).toDate();
                }
            }

            if (this.user.UserId > 0) {
                this.onUpdateData(this.user);
            } else {
                this.onInsertData(this.user);
            }

        }
    }

    // on Insert
    onInsertData(user: User): void {
        user.Creator = user.UserName;

        this.service.post(user)
            .subscribe(dBUser => {
                this.serviceDialogs.context("Regiester Complate", "บัญชีผู้ใช้งานนี้สามารถเข้าใช้งานได้แล้ว", this.viewContainerRef)
                    .subscribe(() => this.onGoBack());
            }, (error: string) => {
                let message: any = error.replace("404 - Not Found", "");

                this.serviceDialogs.error("Register Error", (message || ""), this.viewContainerRef);
            });
    }
    // on Update
    onUpdateData(user: User): void {
        this.service.putKeyNumber(user,user.UserId)
            .subscribe(dBUser => {
                this.serviceAuth.setAuth = dBUser;
                this.serviceDialogs.context("Update Complate", "บัญชีผู้ใช้งานปรับปรุงเรียบร้อย", this.viewContainerRef)
                    .subscribe(() => this.onGoBack());
            }, (error: string) => {
                let message: any = error.replace("404 - Not Found", "");

                this.serviceDialogs.error("Register Error", (message || ""), this.viewContainerRef);
            });
    }

    // on go back
    onGoBack(): void {
        if (this.UpdateProfile) {
            this.router.navigate(["home"]);
        } else {
            this.router.navigate(["login"]);
        }
    }
}