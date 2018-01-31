import { Component, OnInit, OnDestroy, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
    trigger, state, style,
    animate, transition
} from "@angular/animations";
// rxjs
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";
// model
import { JobCardMaster,JobCardDetail } from "../../models/model.index";
// service
import { JobCardMasterService } from "../../services/jobcard-master/jobcard-master.service";
import { JobCardDetailService } from "../../services/jobcard-detail/jobcard-detail.service";
import { DialogsService } from "../../services/dialog/dialogs.service";

@Component({
    selector: "jobcard-waiting",
    templateUrl: "./jobcard-waiting.component.html",
    styleUrls: ["../../styles/schedule.style.scss"],
    animations: [
        trigger("flyInOut", [
            state("in", style({ transform: "translateX(0)" })),
            transition("void => *", [
                style({ transform: "translateX(-100%)" }),
                animate(250)
            ]),
            transition("* => void", [
                animate("0.2s 0.1s ease-out", style({ opacity: 0, transform: "translateX(100%)" }))
            ])
        ])
    ]
})
// jobcard-waiting component
export class JobCardWaitingComponent implements OnInit, OnDestroy {
    // model
    columns: Array<any>;
    jobCardMasters: Array<any>;
    newJobDetail?: JobCardDetail;
    jobCardMaster: JobCardMaster;
    scrollHeight: string;
    subscription: Subscription;
    // time
    message: number = 0;
    count: number = 0;
    time: number = 300;

    // jobcard-waiting ctor
    constructor(
        private service: JobCardMasterService,
        private serviceDetail: JobCardDetailService,
        private serviceDialogs: DialogsService,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
    ) { }

    // called by Angular after jobcard-waiting component initialized
    ngOnInit(): void {
        if (window.innerWidth >= 1600) {
            this.scrollHeight = 75 + "vh";
        } else if (window.innerWidth > 1360 && window.innerWidth < 1600) {
            this.scrollHeight = 68 + "vh";
        } else {
            this.scrollHeight = 65 + "vh";
        }

        this.jobCardMasters = new Array;
        this.onGetJobCardWaitData();
    }

    // destroy
    ngOnDestroy():void {
        if (this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
        }
    }

    // get request data
    onGetJobCardWaitData(): void {
        this.service.getJobCardHasWait()
            .subscribe(dbJobCardWait => {
                this.columns = new Array<any>();

                for (let name of dbJobCardWait.Columns) {
                    if (name.indexOf("Employee") >= 0) {
                        this.columns.push({
                            field: name, header: name,
                            style: { "width": "150px", "text-align": "center" }, styleclass: "time-col"
                        });
                    } else if (name.indexOf("GroupMachine") >= 0) {
                        this.columns.push({
                            field: name, header: name,
                            style: { "width": "150px", "text-align": "center" }, styleclass: "type-col"
                        });
                    } else {
                        this.columns.push({
                            field: name, header: name,
                            style: { "width": "270px" }, styleclass: "singleLine", isButton: true
                        });
                    }
                }

                // debug here

                this.jobCardMasters = dbJobCardWait.DataTable;
                this.reloadData();
            }, error => {
                this.columns = new Array<any>();
                this.jobCardMasters = new Array<any>();
                this.reloadData();
            });
    }

    // reload data
    reloadData(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = Observable.interval(1000)
            .take(this.time).map((x) => x + 1)
            .subscribe((x) => {
                this.message = this.time - x;
                this.count = (x / this.time) * 100;
                if (x === this.time) {
                    this.onGetJobCardWaitData();
                }
            });
    }

    // selected request
    onSelectData(data: any): void {
        let splitArray: Array<string> = data.split("#");

        if (splitArray.length > 0) {
            this.service.postGetMultiKey(splitArray).subscribe(data => {
                this.serviceDialogs.dialogSelectedJobCardDetailForWait(this.viewContainerRef, data)
                    .subscribe(jobCardDetail => {
                        if (jobCardDetail) {
                            // calcel JobCardMaster
                            if (jobCardDetail.JobCardDetailId === -99) {
                                this.onGetJobCardWaitData();
                            } else if (jobCardDetail.JobCardDetailId === -88) { // edit JobCardMaster
                                this.router.navigate(["jobcard/jobcard-waiting-edit/", jobCardDetail.JobCardMasterId]);
                            } else if (jobCardDetail.JobCardDetailId === -77) {
                                this.onNewJobCardDetail(jobCardDetail.JobCardMasterId || 0);
                            } else {
                                // debug here
                                // console.log("JobCardDetail: ", jobCardDetail);
                                
                                this.serviceDialogs.confirm("Choose Work for CuttingPlan", "Yes:For machine group.| No:For other group.", this.viewContainerRef)
                                    .subscribe(result => {
                                        if (result) {
                                            this.router.navigate(["task-machine/jobcard-detail/", jobCardDetail.JobCardDetailId]);
                                        } else {
                                            this.router.navigate(["notask-machine/notask-withjob/", jobCardDetail.JobCardDetailId]);
                                        }
                                    });
                            }
                        }
                    });
                // wait for dev
            }, error => this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef));
        } else {
            this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        }
    }

    // cancel data
    onCancelData(data: any):void {
        // split string
        // let splitArray: Array<string> = data.split("#");
        // if (splitArray.length > 0) {
        //    // string to number
        //    let jobCardKey: number = Number(splitArray[1]);
        //    // check job card can cancel
        //    this.service.getCheckJobCardCanCancel(jobCardKey)
        //        .subscribe((result: boolean) => {
        //            if (result) {
        //                this.serviceDialogs.confirm("Question", "Are you want to cancel the MachineRequired ?", this.viewContainerRef)
        //                    .subscribe(result => {
        //                        if (result) {
        //                            this.service.getCancelJobCardMaster(jobCardKey)
        //                                .subscribe(dbUpdate => {
        //                                    this.onGetJobCardWaitData();
        //                                }, error => {
        //                                    this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        //                                });
        //                        }
        //                    });
        //            } else {
        //                this.serviceDialogs.error("Error Message",
        //                    "Cannot cancel requests from the MachineRequired in System !!!", this.viewContainerRef);
        //            }
        //        }, error => {
        //            this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        //        });
        // } else {
        //    this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
        // }
    }

    // new JobCardDetail
    onNewJobCardDetail(JobMasterId: number):void {
        if (!JobMasterId) {
            this.serviceDialogs.error("Error Message", "Can't found key !!!", this.viewContainerRef);
            return;
        }

        this.service.getOneKeyNumber(JobMasterId)
            .subscribe(dbData => {
                if (dbData) {
                    this.jobCardMaster = dbData;

                    this.newJobDetail = {
                        JobCardMasterId: dbData.JobCardMasterId,
                        JobCardDetailId: 0,
                        JobCardDetailStatus: 1,
                        StatusString: "Wait"
                    };
                }
            }, error => this.serviceDialogs.error("Error Message", "Can't found Machine Required !!!", this.viewContainerRef));
    }

    // on new JobCardDetail Complate or Cancel
    onComplateOrCancel(jobDetail?: JobCardDetail): void {

        if (jobDetail) {
            //debug here
            console.log(jobDetail);

            if (jobDetail.CuttingPlanId || jobDetail.Quality || jobDetail.Material) {
                this.serviceDetail.post(jobDetail)
                    .subscribe(dbJobDetail => {
                        this.serviceDialogs.confirm("What's next ?",
                            "Save was Complated. Do you want to use this \"Machine Required Detail\" for Task Machine",
                            this.viewContainerRef).subscribe(result => {
                                if (result) {
                                    // this.router.navigate(['/heroes', { id: heroId, foo: 'foo' }]);
                                    this.router.navigate(["task-machine/jobcard-detail/", dbJobDetail.JobCardDetailId]);
                                }
                            });
                    }, Error => {
                        this.serviceDialogs.error("Error Message", Error, this.viewContainerRef);
                        return;
                    });
            }
        }

        this.newJobDetail = undefined;
    }
}