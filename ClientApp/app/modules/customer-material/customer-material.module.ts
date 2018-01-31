import { NgModule } from "@angular/core";
import {
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
} from "@angular/material";

import {
    DataTableModule,
    DialogModule,
    SharedModule,
    CalendarModule,
    DropdownModule,
    InputMaskModule,
    TreeModule,
    TreeTableModule,
    AccordionModule,
    AutoCompleteModule,
} from "primeng/primeng";

import { ChartsModule } from "ng2-charts/ng2-charts";

import { AngularSplitModule } from "angular-split";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// component
import { DataTableComponent } from "../../components/base-component/data-table.component";
import { SearchBoxComponent } from "../../components/base-component/search-box.component";
import { AttactFileComponent } from "../../components/base-component/attact-file.component";
import { ReuseTableComponent } from "../../components/base-component/reuse-table.component";
import { BaseChartComponent } from "../../components/base-component/base-chart.component";
import { DateOnlyPipe } from "../../pipes/date-only.pipe";

@NgModule({
    declarations: [
        // component
        DataTableComponent,
        SearchBoxComponent,
        AttactFileComponent,
        ReuseTableComponent,
        BaseChartComponent,
        // pipe
        DateOnlyPipe,
    ],
    imports: [
        // material
        MatButtonModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTabsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        // angularSplit
        AngularSplitModule,
        // ngxDataTable
        NgxDatatableModule,
        // primeNg
        DataTableModule,
        DialogModule,
        SharedModule,
        CalendarModule,
        DropdownModule,
        InputMaskModule,
        TreeModule,
        TreeTableModule,
        AccordionModule,
        AutoCompleteModule,
        // chart
        ChartsModule
    ],
    exports: [
        // material
        MatButtonModule,
        MatCheckboxModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatSidenavModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        MatDialogModule,
        MatTabsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        // angularSplit
        AngularSplitModule,
        // ngxDataTable
        NgxDatatableModule,
        // primeNg
        DataTableModule,
        DialogModule,
        SharedModule,
        CalendarModule,
        DropdownModule,
        InputMaskModule,
        TreeModule,
        TreeTableModule,
        AccordionModule,
        AutoCompleteModule,
        // component
        SearchBoxComponent,
        DataTableComponent,
        AttactFileComponent,
        ReuseTableComponent,
        BaseChartComponent,
        // pipe
        DateOnlyPipe,
        // chart
        ChartsModule
    ],
    entryComponents: [
        SearchBoxComponent,
        DataTableComponent,
        AttactFileComponent,
        ReuseTableComponent,
        BaseChartComponent,
    ]
})
export class CustomMaterialModule { }