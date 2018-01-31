import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from "@angular/forms";

// model
import { Employee } from "../../models/model.index";
// service
import { DialogsService,AuthService } from "../../services/service.index";
import { ProjectCodeMasterService } from "../../services/projectcode-master/projectcode-master.service";
// 3rd praty
import { SelectItem } from "primeng/primeng";
// pipes
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@Component({
    selector: "overtime-master",
    templateUrl: "./overtime-master.component.html",
    styleUrls: [
        "../../styles/master.style.scss",
        "../../styles/edit.style.scss",
    ],
    providers: [
        ProjectCodeMasterService,
    ]
})
// overtime-master component*/
export class OvertimeMasterComponent implements OnInit {

    ValueForm: FormGroup;

    employees: Array<EmployeeOverTime>;
    employee: EmployeeOverTime;
    Value: OverTimeMaster;

    projects: Array<SelectItem>;
    datePipe: DateOnlyPipe = new DateOnlyPipe("it");
    // overtime-master ctor */
    constructor(
        private serviceDialogs: DialogsService,
        private serviceAuth: AuthService,
        private serviceProject: ProjectCodeMasterService,
        private viewContainerRef: ViewContainerRef,
        private fb: FormBuilder,
    ) { }

    // parameter
    // called by Angular after overtime-master component initialized */
    ngOnInit(): void {
        this.employees = new Array;
        this.Value = {
            DescriptionYesterday: "ทำงาน JobNo. 1753/Spool duct\r\nทำได้75%ไปแล้ว.",
            OverTimeDate: new Date(),
            TemplateHour: 3,
        };

        if (this.serviceAuth.getAuth) {
            this.Value.RequireBy = this.serviceAuth.getAuth.NameThai;
        }

        this.serviceProject.getAll()
            .subscribe(dbData => {
                this.projects = new Array;

                this.projects.push({ label: "Select job number.", value: undefined });
                for (let item of dbData) {
                    this.projects.push({ label: `${(item.ProjectCode || "")}`, value: item.ProjectCodeMasterId });
                }
            });

        this.buildForm();
    }

    // build form
    buildForm(): void {
        this.ValueForm = this.fb.group({
            RequireBy: [this.Value.RequireBy],
            Description: [this.Value.Description],
            DescriptionYesterday: [this.Value.DescriptionYesterday],
            JobNo: [this.Value.JobNo],
            TemplateHour: [this.Value.TemplateHour],
            OverTimeDate: [this.Value.OverTimeDate],});
    }
    // on selected employee
    onSelectedEmployee(): void {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
            .subscribe(employees => {
                const form: FormGroup = this.ValueForm;
                const controlT: AbstractControl | null = form.get("TemplateHour");
                let hour: number = 3;
                if (controlT) {
                    if (controlT.value) {
                        if (controlT.value) {
                            hour = controlT.value;
                        }
                    }
                }

                if (employees) {
                    employees.forEach(item => {
                        if (!this.employees.find(item2 => item2.EmpCode === item.EmpCode)) {
                            let employeeOT: EmployeeOverTime = {
                                EmpCode: item.EmpCode,
                                GroupCode: item.GroupCode,
                                GroupName: item.GroupName,
                                NameEng: item.NameEng,
                                NameThai: item.NameThai,
                                OverTime: hour,
                                OverTimeDate: new Date(),
                                Title: item.Title,
                                TypeEmployee: item.TypeEmployee,
                            };
                            this.employees.push(employeeOT);
                            this.employees = this.employees.slice();
                        }
                    });
                }
            });
    }

    // on clear employee
    onClearEmployee(): void {
        if (this.employees) {
            this.employees = new Array;
        }
    }

    // on remove employee
    onRemoveEmployee(employeeOT?: EmployeeOverTime): void {
        if (employeeOT && this.employees) {
            let index: number = this.employees.indexOf(employeeOT);
            if (index > -1) {
                // remove employee from array
                this.employees.splice(index, 1);
                this.employees = [...this.employees];
            }
        }
    }

    // update value
    updateValue(event: any, cell: string, rowIndex: number): void {
        console.log("inline editing rowIndex", rowIndex);
        console.log(rowIndex + "-" + cell);

        // this.employees[rowIndex][cell] = event.target.value;
        // this.employees = [...this.employees];
        // console.log("UPDATED!", this.employees[rowIndex][cell]);
    }

}

export interface EmployeeOverTime {
    EmpCode: string;
    Title?: string;
    NameThai?: string;
    NameEng?: string;
    TypeEmployee?: number;
    GroupCode?: string;
    GroupName?: string;
    OverTime?: number;
    OverTimeDate?: Date;
    Description?: string;
}

export interface OverTimeMaster {
    RequireBy?: string;
    JobNo?: string;
    Description?: string;
    DescriptionYesterday?: string;
    TemplateHour?: number;
    OverTimeDate?: Date;
}