import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the ProjectTeamProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProjectTeam {

  constructor(public api: Api) { }

  ListMembers(projectid: string, customerid) {

    let params = { projectid: projectid, customerid: customerid };    
    let seq = this.api.get('projectteammembers', params);

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  ListAvailableMembers(projectid: string, companyid: string) {
    
    let params = { projectid: projectid, companyid: companyid};    
    let seq = this.api.get('projectteamavailable', params);

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  TeamMemberInfo(UserId: string, ProjectTeamId: string) {
    
    let params = { userid: UserId, projectteamid: ProjectTeamId};    
    let seq = this.api.get('projectteammember', params);

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  TeamMemberUpdate(params) {
        
    let seq = this.api.post('projectteammember', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  AddTeamMembers(params: any) {
    let seq = this.api.post('projectteammembers', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  RemoveTeamMembers(projectteamList: any) {
    let params = { projectteamid: projectteamList.toString() };
    let seq = this.api.delete('projectteammembers', params).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    
    return seq;
  }

}
