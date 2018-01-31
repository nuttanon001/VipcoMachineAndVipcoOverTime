import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'task-machine',
    templateUrl: './task-machine.component.html',
    styleUrls: ["../../styles/developer.style.scss"],
})
/** task-machine component*/
export class TaskMachineComponent implements OnInit {
    machines =
    [
        "ND06-CNC Auto Gas cutting Machine",
        "ND07-NC AUTO DRILL MACHINE(CNCMachineing center)",
        "LM04-เครื่องกลึง LATHE MACHINE",
        "LM07-เครื่องBORING  LATHE MACHINE",
        "LM11-เครื่องBORING  PANOMILLER"
    ];

    jobCardDetails =
    [
        "Y17-1739-1511-F-H13",
        "Y17-1739-1511-A-H13",
        "Y17-1753-R1-3-C09-01",
        "Y17-1748-TC10-11-C11",
        "Y17-1739-1512-E-H13",
    ];

    taskMachine: Array<any>;
    columns: Array<any>;
    /** task-machine ctor */
    constructor() { }

    /** Called by Angular after task-machine component initialized */
    ngOnInit(): void {
        this.columns = [
            { field: "MachineNo", header: "MachineNo", style: { 'width': '10%' }, styleclass: "col-class" },
            { field: "JobNo", header: "JobNo", style: { 'width': '15%' } },
            { field: "Cutting", header: "CuttingPlan" },
            { field: "QTY", header: "Qty", style: { 'width': '5%' }},
            { field: "PRO", header: "Pro", style: { 'width': '5%' }},
            { field: "Progess", header: "Per", style: { 'width': '5%' }},
            { field: "Col1", header: "19", style: { 'width': '25px' }, isCol:true },
            { field: "Col2", header: "20", style: { 'width': '25px' }, isCol: true },
            { field: "Col3", header: "21", style: { 'width': '25px' }, isCol: true },
            { field: "Col4", header: "22", style: { 'width': '25px' }, isCol: true },
            { field: "Col5", header: "23", style: { 'width': '25px' }, isCol: true },
            { field: "Col6", header: "24", style: { 'width': '25px' }, isCol: true },
            { field: "Col7", header: "25", style: { 'width': '25px' }, isCol: true },
            { field: "Col8", header: "26", style: { 'width': '25px' }, isCol: true },
            { field: "Col9", header: "27", style: { 'width': '25px' }, isCol: true },
            { field: "Col10", header: "28", style: { 'width': '25px' }, isCol: true },
            { field: "Col11", header: "29", style: { 'width': '25px' }, isCol: true },
            { field: "Col12", header: "30", style: { 'width': '25px' }, isCol: true },
            { field: "Col13", header: "1", style: { 'width': '25px' }, isCol: true },
            { field: "Col14", header: "2", style: { 'width': '25px' }, isCol: true },
            { field: "Col15", header: "3", style: { 'width': '25px' }, isCol: true },
            { field: "Col16", header: "4", style: { 'width': '25px' }, isCol: true },
            { field: "Col17", header: "5", style: { 'width': '25px' }, isCol: true },

        ];

        this.taskMachine = [
            {
                MachineNo: "ND06", JobNo: "1753/Inlet Duct", Cutting: "Y17-1753-ID-1-PL6-01", QTY: "8", PRO: "0", Progess: "0%",
                Col1: "1", Col2: "1", Col3: "1", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND06", JobNo: "1753/Outlet duct", Cutting: "Y17-1753-OD-P408-01", QTY: "6", PRO: "2", Progess: "33%",
                Col1: "", Col2: "", Col3: "2", Col4: "1", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND06", JobNo: "1753/Outlet duct", Cutting: "Y17-1753-OD-C04-01", QTY: "6", PRO: "1", Progess: "17%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "2", Col6: "1", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND06", JobNo: "1753/Built up beam", Cutting: "Y17-1753-BU-A572-PL15-01", QTY: "6", PRO: "0", Progess: "0%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "1", Col8: "1", Col9: "1", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND06", JobNo: "1753/Spool duct", Cutting: "Y17-1753-SD-C03-01", QTY: "7", PRO: "0", Progess: "0%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "1", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND06", JobNo: "1754/Stack", Cutting: "Y17-1754-SK1-P411-01", QTY: "9", PRO: "7", Progess: "78%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "2", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND06", JobNo: "1754/Stack", Cutting: "Y17-1754-SK1-L130-01", QTY: "9", PRO: "5", Progess: "56%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "2", Col12: "",
            },
            {
                MachineNo: "ND08", JobNo: "1753/Inlet Duct", Cutting: "Y17-1753-ID-1-PL6-02", QTY: "1", PRO: "0", Progess: "0%",
                Col1: "1", Col2: "1", Col3: "1", Col4: "1", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND08", JobNo: "1753/Outlet duct", Cutting: "Y17-1753-OD-P413-01", QTY: "5", PRO: "4", Progess: "80%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "2", Col6: "2", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND08", JobNo: "1753/Built up beam", Cutting: "Y17-1753-BU-A572-PL10-01", QTY: "3", PRO: "2", Progess: "67%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "2", Col8: "1", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND08", JobNo: "1753/Built up beam", Cutting: "Y17-1753-BU-A572-PL16-01", QTY: "2", PRO: "1", Progess: "50%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "1", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND08", JobNo: "1753/Spool duct", Cutting: "Y17-1753-SD-C04-01", QTY: "10", PRO: "6", Progess: "60%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "1", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND08", JobNo: "1754/Stack", Cutting: "Y17-1754-SK1-P413-01", QTY: "9", PRO: "9", Progess: "100%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "1",
            },
            {
                MachineNo: "ND08", JobNo: "1754/Stack", Cutting: "Y17-1754-SK1-L150-01", QTY: "8", PRO: "1", Progess: "13%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "1",
            },
            {
                MachineNo: "ND10", JobNo: "1753/Inlet Duct", Cutting: "Y17-1753-ID-1-PL6-03", QTY: "7", PRO: "2", Progess: "29%",
                Col1: "", Col2: "2", Col3: "1", Col4: "1", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND10", JobNo: "1753/Outlet duct", Cutting: "Y17-1753-OD-C03-01~02", QTY: "2", PRO: "1", Progess: "50%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "2", Col6: "1", Col7: "", Col8: "", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND10", JobNo: "1753/Built up beam", Cutting: "Y17-1753-BU-A572-PL12-01", QTY: "1", PRO: "0", Progess: "0%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "1", Col8: "1", Col9: "", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND10", JobNo: "1753/Spool duct", Cutting: "Y17-1753-SD-P413-01", QTY: "9", PRO: "4", Progess: "44%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "1", Col10: "", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND10", JobNo: "1753/Spool duct", Cutting: "Y17-1753-SD-C11-01", QTY: "7", PRO: "6", Progess: "86%",
                Col1: "", Col2: "", Col3: "", Col4: "", Col5: "", Col6: "", Col7: "", Col8: "", Col9: "", Col10: "2", Col11: "", Col12: "",
            },
            {
                MachineNo: "ND10", JobNo: "1754/Stack", Cutting: "Y17-1754-SK1-P415-01", QTY: "9", PRO: "9", Progess: "100%",
                Col11: "2", Col12: "",
            },
        ];
    }

    // change row class
    customRowClass(rowData: any): string {
        if (rowData) {
            return rowData.Pass ? "enabled-row" : "disabled-row";
        } else {
            return "";
        }
    }
}