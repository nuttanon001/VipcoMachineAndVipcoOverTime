import { Injectable } from '@angular/core';
import { BaseRestService } from '../base-service/base-rest.service';
import { BomLevel } from '../../models/overtime-master/bom-master.model';
import { Http } from '@angular/http';

@Injectable()
export class BomMasterService extends BaseRestService<BomLevel> {
    constructor(http: Http) {
        super(http, "http://192.168.2.31/extends-sagex3/api/BomLevel/");
        // "http://192.168.2.31/machinemk2/api/version2/Employee/",
    }
}