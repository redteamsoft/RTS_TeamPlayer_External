import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { MenuController, Platform } from 'ionic-angular';
import { Constant } from '../constant/constant';
//import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class User {
  _userid: any;
  _nulluserpass: any;
  _userfirstname: any;
  _userlastname: any;
  _companyname: any;
  _refreshpage: any;
  _refreshprevpage: any;
  _useraddress: any;
  _usercity: any;
  _usercompanyid: any;
  _usercountry: any;
  _useremail: any;
  _usermobile: any;
  _userphonenumber: any;
  _userstateorprovince: any;
  _userwebpage: any;
  _userzipcode: any;
  _userpass: any;
  _userposition: any;
  _StatusRelationship: any;
  _Product: any;
  _ContentDisabled: any;
  _PremiumContent: any;
  _ViewPremiumContent: any;
  _preferencebilling: any;

  constructor(public api: Api, public menu: MenuController, public constant: Constant, public platform: Platform) { }

  loginValidate(accountInfo: any) {
    let params = { email: accountInfo.email, password: accountInfo.password };
    let seq = this.api.get('loginvalidate', params, false).share();

    seq.subscribe((res: any) => {
      if (res[0].Logged == 1) {
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  controlLogin(userid: string) {
    let type: string;
    if (!this.platform.is('core') && !this.platform.is('mobileweb')) {
      type = "mobile"
    }
    else {
      type = "web"
    }
    let params = { userid: userid, action: "login", type: type };
    let seq = this.api.get('controllogin', params, false).share();

    seq.subscribe((res: any) => {
      this._loggedIn(res, userid, '');
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  UserPermissions(userid: string) {

    let params = { userid: userid };
    let seq = this.api.get('userpermissions', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  validateUserPermissions(sourceRoute) {

    var action: any;
    action = false;
    var trimSource = sourceRoute.toUpperCase().replace(/\s/g, "");
    if (window.localStorage.getItem('tp_userpermissions')) {
      //var userObj = JSON.parse(atob(sessionStorage.getItem('user').slice(0, -1).substring(1)));

      //if(userObj.Businessproducts == "TeamPlayer Premium") {

      var sessionsPermissions = JSON.parse(atob(window.localStorage.getItem('tp_userpermissions')));
      sessionsPermissions.forEach(obj => {
        if (obj.trimPermissionName.toUpperCase() == trimSource.toUpperCase()) {
          if (obj.AccessLevel_tp == 0) {
            action = "NoAccess";
            //this.navCtrl.push("ViewBillingPage");
          } else if (obj.AccessLevel_tp == 1) {
            //"View Only";
            action = true;
          } else if (obj.AccessLevel_Tp == 2 || obj.AccessLevel_Tp == null) {
            //"Full Acces";
            action = false;
          }
        }
      });

      //}
    }

    return action
  }

  getVersion() {
    let seq = this.api.getVersion(false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  controlLoginbridge(userid: string) {
    let params = { userid: userid, action: "login", type: "bridge" };
    let seq = this.api.get('controllogin', params, false).share();

    seq.subscribe((res: any) => {
      let useridbridge = res[0] ? res[0].UserID : res.UserID;
      this._loggedIn(res, useridbridge, '');
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  verifyEmail(email: string) {
    let params = { email: email };
    let seq = this.api.get('emailverification', params, false).share();

    seq.subscribe((res: any) => {
      if (res[0].EmailExist == 1) {
      } else {
      }
    }, err => {
      console.error('ERROR--->', err);
    });

    return seq;
  }

  authorizationCode(userid: string, type: string, code: string) {
    let params = { userid: userid, type: type, code: code };
    let seq = this.api.get('authorizationcode', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR--->', err);
    });

    return seq;
  }

  userAccepted(userid: string) {
    let params = { userid: userid };
    let seq = this.api.get('useraccepted', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR--->', err);
    });

    return seq;
  }

  async editInfo(accountInfo: any, band) {
    let seq: any;
    try {
       seq = await this.api.post('editinfo', accountInfo, false).share().toPromise();
       //console.log('saving user');
       if (band) {
        this._loggedIn(accountInfo, accountInfo.userid, accountInfo.band);
      } else {
        if (accountInfo.userid == this._userid) {
          this._userfirstname = accountInfo.firstname;
          this._userlastname = accountInfo.lastname;
          this._userposition = accountInfo.userposition;
          this._useremail = accountInfo.email;
          this._usermobile = accountInfo.mobile;
          this._userpass = accountInfo.password;
        }
        this._refreshpage = "false";
      }
      await this.editTAInfo(accountInfo.companyid, accountInfo.userid, accountInfo.band);
    } catch (error) {
      console.log(error);
    }
    return seq;
  }

  async editTAInfo(companyid, userid, band) {
    let params = { companyid: companyid, userid: userid, band: band };
    let seq: any;
    try {
      seq = await this.api.post('taeditinfo', params, false).share().toPromise(); 
    } catch (error) {
      console.log(error);
    }
    return seq;
  }

  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      if (res.status == 'success') {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  logout() {
    let params = { userid: this._userid, action: "logout" };
    let seq = this.api.get('controllogin', params, false).share();

    seq.subscribe((res: any) => {

      this._userid = null;
      this._nulluserpass = null;
      this._userfirstname = null;
      this._userlastname = null;
      this._companyname = null;
      this._refreshpage = null;
      this._refreshprevpage = null;
      this._userposition = null;

      this._useraddress = null;
      this._usercity = null;
      this._usercompanyid = null;
      this._usercountry = null;
      this._useremail = null;
      this._usermobile = null;
      this._userphonenumber = null;
      this._userstateorprovince = null;
      this._userwebpage = null;
      this._userzipcode = null;
      this._userpass = null;
      this._preferencebilling = null;

      window.localStorage.removeItem('userid');
      window.localStorage.removeItem('nulluserpass');
      window.localStorage.removeItem('userfirstname');
      window.localStorage.removeItem('userlastname');
      window.localStorage.removeItem('companyname');
      window.localStorage.removeItem('refreshpage');
      window.localStorage.removeItem('refreshprevpage');
      window.localStorage.removeItem('useraddress');
      window.localStorage.removeItem('usercity');
      window.localStorage.removeItem('usercompanyid');
      window.localStorage.removeItem('usercountry');
      window.localStorage.removeItem('useremail');
      window.localStorage.removeItem('usermobile');
      window.localStorage.removeItem('userphonenumber');
      window.localStorage.removeItem('userstateorprovince');
      window.localStorage.removeItem('userwebpage');
      window.localStorage.removeItem('userzipcode');
      window.localStorage.removeItem('userpass');
      window.localStorage.removeItem('forgetpass');
      window.localStorage.removeItem('userposition');
      window.localStorage.removeItem('tp_userpermissions');
      window.localStorage.removeItem('preferencebilling');
      window.localStorage.removeItem('CurrentUserBusinessProduct');

      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        localStorage.removeItem('tp_access_token');
        sessionStorage.removeItem('tp_access_token');
        sessionStorage.removeItem('tp_session');
        sessionStorage.removeItem('tp_userid');
      }

    }, err => {
      console.error('ERROR', err);
    });
  }

  _loggedIn(resp, userid, band) {
    this._userid = userid;
    this._usercompanyid = resp[0] ? resp[0].CompanyId : resp.companyid;
    this._userposition = resp[0] ? resp[0].UserPosition : resp.userposition;

    if (band == '' || band == 'profile') {
      this._userfirstname = resp[0] ? resp[0].FirstName : resp.firstname;
      this._userlastname = resp[0] ? resp[0].LastName : resp.lastname;
      this._useremail = resp[0] ? resp[0].Email : resp.email;
      this._usermobile = resp[0] ? resp[0].Mobile : resp.mobile;
      this._userpass = resp[0] ? resp[0].UserPass : resp.password;
    }

    if (band == '' || band == 'company') {
      this._companyname = resp[0] ? resp[0].CompanyName : resp.companyname;
      this._useraddress = resp[0] ? resp[0].Address : resp.address;
      this._usercity = resp[0] ? resp[0].City : resp.city;
      this._usercountry = resp[0] ? resp[0].Country : resp.country;
      this._userstateorprovince = resp[0] ? resp[0].StateOrProvince : resp.stateorprovince;
      this._userwebpage = resp[0] ? resp[0].WebPage : resp.webpage;
      this._userzipcode = resp[0] ? resp[0].ZipCode : resp.zipcode;
      this._userphonenumber = resp[0] ? resp[0].PhoneNumber : resp.phonenumber;
    }

    this._preferencebilling = resp[0] ? resp[0].PreferenceBilling : resp.preferencebilling;
    this._nulluserpass = resp[0] ? resp[0].NullUserPass : resp.NullUserPass;

    this._refreshpage = "false";
    this._refreshprevpage = "false";
    window.localStorage.setItem('userid', this._userid);
    window.localStorage.setItem('nulluserpass', this._nulluserpass);
    window.localStorage.setItem('userfirstname', this._userfirstname);
    window.localStorage.setItem('userlastname', this._userlastname);
    window.localStorage.setItem('companyname', this._companyname);
    window.localStorage.setItem('refreshpage', this._refreshpage);
    window.localStorage.setItem('refreshprevpage', this._refreshprevpage);
    window.localStorage.setItem('userposition', this._userposition);

    window.localStorage.setItem('useraddress', this._useraddress);
    window.localStorage.setItem('usercity', this._usercity);
    window.localStorage.setItem('usercompanyid', this._usercompanyid);
    window.localStorage.setItem('usercountry', this._usercountry);
    window.localStorage.setItem('useremail', this._useremail);
    window.localStorage.setItem('usermobile', this._usermobile);
    window.localStorage.setItem('userphonenumber', this._userphonenumber);
    window.localStorage.setItem('userstateorprovince', this._userstateorprovince);
    window.localStorage.setItem('userwebpage', this._userwebpage);
    window.localStorage.setItem('userzipcode', this._userzipcode);
    window.localStorage.setItem('userpass', this._userpass);
    window.localStorage.setItem('preferencebilling', this._preferencebilling);

  }

  _UserCompanyConfig(item: any) {

    this._StatusRelationship = item ? item.StatusRelationship : '';
    this._Product = item ? item.Product : '';
    this._ContentDisabled = this._StatusRelationship == 0 ? true : false;
    //console.log(this._ContentDisabled)
    //7 = Basic, 8 = Premium
    this._PremiumContent = this._Product == 8 ? true : false;
    //console.log(this._PremiumContent)
    this._ViewPremiumContent = (this._ContentDisabled && !this._PremiumContent) ? false : true;
    //console.log(this._ViewPremiumContent);
    window.localStorage.setItem('contentdisabled', this._ContentDisabled);
    window.localStorage.setItem('premiumcontent', this._PremiumContent);
    window.localStorage.setItem('viewpremiumcontent', this._ViewPremiumContent);
    window.localStorage.setItem('statusrelationship', this._StatusRelationship);
    window.localStorage.setItem('product', this._Product);
  }

  UserList(companyid: string, records: string) {
    let params = { companyid: companyid, records: records };
    let seq = this.api.get('users', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR--->', err);
    });

    return seq;
  }

  ValidateToken() {
    let params = {
      userid: sessionStorage.getItem('tp_userid'),
      loginid: sessionStorage.getItem("tp_session"),
      token: sessionStorage.getItem("tp_access_token")
    };
    let seq = this.api.get('validatetoken', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR--->', err);
    });

    return seq;
  }

  AccountDetails() {
    let params = { companyid: this._usercompanyid };
    let seq = this.api.get('accountdetails', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR--->', err);
    });

    return seq;
  }

}
