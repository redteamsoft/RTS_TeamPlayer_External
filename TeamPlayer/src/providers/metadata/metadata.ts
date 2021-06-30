import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

/*
  Generated class for the MetadataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Metadata {

  constructor(public api: Api) { }

  InsertData(params: any) {
    
    let seq = this.api.post('metadata', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

}
