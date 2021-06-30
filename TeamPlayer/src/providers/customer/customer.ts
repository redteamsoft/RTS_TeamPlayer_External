import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { User } from '../../providers';

@Injectable()
export class Customer { 
  _customerid: any;
  _customername: any; 
  _address: any;
  _city: any;
  _stateorprovince: any;
  _zipcode: any;
  _phonenumber: any; 

  constructor(public api: Api,public user: User) { }

  CustomerList(records:string) {
 
    let params = {userid: this.user._userid, records: records}; 
    let seq = this.api.get('customers',params,false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  _customerStorage(item: any) {       
    this._customerid = item ? item.CustomerID : '';
    this._customername = item ? item.CustomerName : '';
    this._address = item ? item.CustomerAddress : '';
    this._city = item ? item.CustomerCity : '';
    this._stateorprovince = item ? item.CustomerStateOrProvince : '';
    this._zipcode = item ? item.CustomerZipCode : '';
    this._phonenumber = item ? item.CustomerPhoneNumber : ''; 

    window.localStorage.setItem('customerid', this._customerid);
    window.localStorage.setItem('customername', this._customername);
    window.localStorage.setItem('address', this._address);
    window.localStorage.setItem('city', this._city);
    window.localStorage.setItem('stateorprovince', this._stateorprovince);
    window.localStorage.setItem('zipcode', this._zipcode);
    window.localStorage.setItem('phonenumber', this._phonenumber); 
  }
}
