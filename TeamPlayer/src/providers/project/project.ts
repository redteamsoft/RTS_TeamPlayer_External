import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { User } from '../../providers';
import { Customer } from '../../providers'; 

@Injectable()
export class Project { 
  _projectid: any;
  _projectname: any;
  _projectnumber: any;
  _projectscope: any;
  _rtprojectid: any;
  _rtDateformat: any;
  _rtMonetarySymbol: any;
  _rtProjNum: any;
  _rtScopeNum: any;

  constructor(public api: Api, public user: User, public customer: Customer) { }

  ProjectList(records:string, projectid: string) {

    let params = {userid: this.user._userid, customerid: this.customer._customerid, records: records, projectid: projectid}; 
    let seq = this.api.get('projects',params,false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

   _projectStorage(item: any) {       
    this._projectid = item ? item.ProjectID : '';
    this._projectname = item ? item.ProjectName : '';
    this._projectnumber = item ? item.ProjectNumber : '';
    this._projectscope = item ? item.ProjectScope : '';
    this._rtprojectid = item ? item.RTProjectID : '';   
    this._rtDateformat = item ? item.RTDateformat : '';   
    this._rtMonetarySymbol = item ? item.RTMonetarySymbol : '';   
    this._rtProjNum = item ? item.ProjNum : '';   
    this._rtScopeNum = item ? item.ScopeNum : '';   
    window.localStorage.setItem('projectid', this._projectid);
    window.localStorage.setItem('projectname', this._projectname);
    window.localStorage.setItem('projectnumber', this._projectnumber);
    window.localStorage.setItem('projectscope', this._projectscope);
    window.localStorage.setItem('rtprojectid', this._rtprojectid);
    window.localStorage.setItem('rtdateformat', this._rtDateformat);
    window.localStorage.setItem('rtmonetarysymbol', this._rtMonetarySymbol);
    window.localStorage.setItem('rtprojnum', this._rtProjNum);
    window.localStorage.setItem('rtscopenum', this._rtScopeNum);
  }
}

