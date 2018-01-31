// angular
import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
// models
import { Employee, EmployeeGroup } from "../../models/model.index";
// components
import { BaseEditComponent } from "../base-component/base-edit.component";
// services
import { EmployeeService, EmployeeServiceCommunicate } from "../../services/employee/employee.service";
import { EmployeeGroupMisService } from "../../services/employee-group/employee-group-mis.service";
import { EmployeeGroupService } from "../../services/employee-group/employee-group.service";
// primeng
import { SelectItem } from "primeng/primeng";


@Component({
    selector: "employee-edit",
    templateUrl: "./employee-edit.component.html",
    styleUrls: ["../../styles/edit.style.scss"],
})
// employee-edit component*/
export class EmployeeEditComponent
    extends BaseEditComponent<Employee, EmployeeService> {

    employeeGroup: Array<SelectItem>;
    employeeGroupMis: Array<SelectItem>;
    employeeTitle: Array<SelectItem>;

    // employee-edit ctor */
    constructor(
        service: EmployeeService,
        serviceCom: EmployeeServiceCommunicate,
        private viewContainerRef: ViewContainerRef,
        private serviceEmployeeGroup: EmployeeGroupService,
        private serviceEmployeeGroupMis: EmployeeGroupMisService,
        private fb: FormBuilder
    ) {
        super(
            service,
            serviceCom,
        );
    }

    // on get data by key
    onGetDataByKey(value?: Employee): void {
        if (value) {
            this.service.getOneKeyString(value.EmpCode)
                .subscribe(dbData => {
                    this.editValue = dbData;
                    this.editValue.InsertOrUpdate = "Update";
                }, error => console.error(error), () => this.defineData());
        } else {
            this.editValue = {
                EmpCode: "",
                Title: "นาย",
                TypeEmployee: 5,
                TypeEmployeeString: "พนักงานพม่า",
                InsertOrUpdate: "Insert"
            };
            this.defineData();
        }
    }

    // define data for edit form
    defineData(): void {
        this.buildForm();

        // employeeGroup ComboBox
        this.serviceEmployeeGroup.getAll()
            .subscribe(dbEmployeesGroup => {
                this.employeeGroup = new Array;
                this.employeeGroup.push({ label: "-", value: undefined });
                for (let item of dbEmployeesGroup) {
                    this.employeeGroup.push({ label: `${(item.Description || "")}`, value: item.GroupCode });
                }
            }, error => console.error(error));

        // employeeGroupMis ComboBox
        this.serviceEmployeeGroupMis.getAll()
            .subscribe(dbEmployeeGroupMis => {
                this.employeeGroupMis = new Array;
                this.employeeGroupMis.push({ label: "-", value: undefined });
                for (let item of dbEmployeeGroupMis) {
                    this.employeeGroupMis.push({ label: `${(item.GroupDesc || "")}`, value: item.GroupMIS });
                }
            },error => console.error(error));

        // employeeTitle
        if (!this.employeeTitle) {
            this.employeeTitle = new Array;
            this.employeeTitle.push({ label: "นาย", value: "นาย" });
            this.employeeTitle.push({ label: "นาง", value: "นาง" });
            this.employeeTitle.push({ label: "นางสาว", value: "นางสาว" });
            this.employeeTitle.push({ label: "อื่นๆ", value: "อื่นๆ" });
        }
    }

    // build form
    buildForm(): void {
        this.editValueForm = this.fb.group({
            EmpCode: [this.editValue.EmpCode,
                [
                    Validators.required,
                ]
            ],
            Title: [this.editValue.Title,
                [
                    Validators.required,
                ]
            ],
            NameThai: [this.editValue.NameThai,
                [
                    Validators.required,
                    Validators.maxLength(100),
                ]
            ],
            NameEng: [this.editValue.NameEng,
                [
                    Validators.maxLength(100),
                ]
            ],
            TypeEmployee: [this.editValue.TypeEmployee,
                [
                    Validators.required,
                ]
            ],
            GroupCode: [this.editValue.GroupCode,
                [
                    Validators.required,
                ]
            ],
            GroupName: [this.editValue.GroupName],
            GroupMIS: [this.editValue.GroupMIS,
                [
                    Validators.required,
                ]
            ],
            TypeEmployeeString: [this.editValue.TypeEmployeeString],
            InsertOrUpdate: [this.editValue.InsertOrUpdate]
        });
        this.editValueForm.valueChanges.subscribe((data: any) => this.onValueChanged(data));
    }

    // on valid data override
    onFormValid(isValid: boolean): void {
        this.editValue = this.editValueForm.value;
        if (this.editValue.GroupCode) {
            const groupName: SelectItem | undefined = this.employeeGroup.find((item) => item.value === this.editValue.GroupCode);
            if (groupName) {
                this.editValue.GroupName = groupName.label;
            }
        }

        this.communicateService.toParent([this.editValue, isValid]);
    }
}