import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { User } from '../../providers';
import { Project } from '../../providers';
import { Customer } from '../../providers';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { Constant } from '../constant/constant';

@Injectable()
export class Transaction {
  _transactionid: any;
  _transactiondetailid: any;
  _sourceid: any;
  _charsourceid: any;
  _transactiontype: any;
  _transactionnumber: any;
  _projectnumber: any;
  _subject: any;
  _status: any;
  _transactionduedate: any;
  _submitteddate: any;
  _company: any;
  _dbname: any;
  _amountsubmitted: any;
  _datesdif: any;
  _requester: any;
  _requesterposition: any;
  _attachmentname: any;
  _paymenttermsname: any;
  _paymenttermsduedays: any;
  _requesteremail: any;
  _vatvenuevalue: any;
  _taxvenuevalue: any;
  _retainagevalue: any;
  _notes: any;
  _footer: any;
  _olddata: any;

  constructor(public api: Api, public user: User, public project: Project, public customer: Customer,
    private decimalPipe: DecimalPipe, private percentPipe: PercentPipe, private constant: Constant) {

  }

  GetPurchaseEapps(company: number, counteapps: number) {
    let params = { Company: company, counteapps: counteapps };

    let seq = this.api.eappspost('GetPurchaseList', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }


  TransactionList(records: string, transactionid: string ) {
    let type = ''//All Types    
    let params = { type: type, userid: this.user._userid, projectnumber: this.project._projectnumber, customerid: this.customer._customerid, records: records, transactionid: transactionid };
    let seq = this.api.get('transactions', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillingList() {
    let params = { id: this._transactionid, dbname: this._dbname };
    let seq = this.api.get('billings', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  ContractDocumentList() {
    let params = { workorderid: this.project._projectnumber, ordnum: this._transactionnumber, dbname: this._dbname, userid: this.user._userid };
    let seq = this.api.get('contractdocuments', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  ContractDocumentPremiumList() {
    let params = { id: this._transactionid };
    let seq = this.api.get('contractdocumentspremium', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  SubmitQuote(type: string, amount: string, filename: string, filesize: string, fileextenssion: string, optprivate: string, defaulturl: string, linkshorturl: string, userid: string, action: string, items: string, facilityid: string, formattedDate: string) {

    let params = {
      type: type,
      amount: amount,
      projectid: this.project._projectnumber,
      scope: this.project._projectscope,
      createdate: formattedDate,
      sourceid: this._sourceid,
      filename: filename,
      filesize: filesize,
      fileextenssion: fileextenssion,
      optprivate: optprivate,
      defaulturl: defaulturl,
      linkshorturl: linkshorturl,
      dbname: this._dbname,
      userid: userid,
      action: action,
      items: items,
      facilityid: facilityid
    };

    let seq = this.api.post('submitquote', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  UploadAttachment(item: any, fileName: string, folder: string, num: any) {

    let params = {
      transactiondetailid: this._transactiondetailid,
      filename: fileName,
      filedescription: item.description,
      filetype: item.type,
      uploadfolder: folder,
      attachnumber: num,
    };

    let seq = this.api.post('uploadinfoattach', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  UpdateDescAttachment(item: any) {
    //TODO: update Description Attach
    let params = {
      uploadid: item.uploadid,
      description: item.description,
    };

    let seq = this.api.post('updatedescattach', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillAttachments() {

    let params = { transactiondetailid: this._transactiondetailid };
    let seq = this.api.get('billattachments', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillDeleteAttachment(uploadid: string) {

    let params = { uploadid: uploadid };
    let seq = this.api.post('billdeleteattachment', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  RFQResponse(type: string, projectid: string) {
    let params = { type: type, userid: this.user._userid, projectid: projectid };
    let seq = this.api.get('transactions', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  UpdateTransaction(status: string, transactiontype: string, amount: string, filename: string, transactionnumber: string, transactiondate: string, daystoexpire: string, paymenttermsid: string, notes: string) {

    let prevexpirationdate
    let expirationdate
    if (daystoexpire != '') {
      prevexpirationdate = new Date(transactiondate);
      prevexpirationdate.setDate(prevexpirationdate.getDate() + Number(daystoexpire));

      expirationdate = (new Date((new Date((new Date(new Date(prevexpirationdate))).toISOString())).getTime() - ((new Date(prevexpirationdate)).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ');
    } else {
      expirationdate = ''
    }

    let params = {
      status: status,
      transactiontype: 'SubmitQuote',
      transactionid: this._transactionid,
      amount: amount,
      filename: filename,
      transactionnumber: transactionnumber,
      transactiondate: transactiondate,
      expirationdate: expirationdate,
      paymenttermsid: paymenttermsid,
      notes: notes
    };

    let seq = this.api.post('updatetransaction', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  QuoteDetails(sourceid: string, dbname: string) {
    let params = { sourceid: sourceid, dbname: dbname };
    let seq = this.api.get('quotedetails', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  CommitmentDetails(sourceid: string, ordnum: string, dbname: string) {
    let params = { sourceid: sourceid, ordnum: ordnum, dbname: dbname };
    let seq = this.api.get('commitmentdetails', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  QuoteScopeLst() {
    let params = { projectid: this.project._projectnumber, scope: this.project._projectscope, sourceid: this._sourceid, dbname: this._dbname };
    let seq = this.api.get('quotescope', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  QuoteAssembly() {
    let params = { sourceid: this._sourceid, dbname: this._dbname };
    let seq = this.api.get('quoteassembly', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  PaymentTerms() {
    let params = {};
    let seq = this.api.get('paymentterms', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  TaxVenues() {
    let params = {};
    let seq = this.api.get('taxvenues', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  ViewRFQ() {
    let params = { userid: this.user._userid, companyid: this.user._usercompanyid, projectid: this.project._projectnumber, scope: this.project._projectscope, dbname: this._dbname, sourceid: this._sourceid };
    let seq = this.api.get('viewrfq', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  ViewCommitment() {
    let urlCommitment = this.constant.urlCommitment;
    let params = { buyoutID: this._charsourceid, client: this._dbname, user_tp: this.user._userid };
    let seq = this.api.getRT(urlCommitment, params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  ViewPlanroom() {
    let params = { userid: this.user._userid, dbname: this._dbname, sourceid: this._charsourceid };
    let seq = this.api.get('commitmentuser', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  Route(invoiceid: any) {
    let urlRoute = this.constant.urlRoute;
    let params = { band: "route", client: this._dbname, invoiceid: invoiceid };
    let seq = this.api.getRT(urlRoute, params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  WebGeneratePDF(fileName: string,
    quotenumber: string,
    today: string,
    notes: string,
    quotesitems: string,
    quoteassemblydesc: string,
    quoteamount: string,
    daystoexpire: string,
    ptdescription: string) {

    let filePath: string = 'sourceid=' + this._sourceid + '&' +
      'companyname=' + this.user._companyname + '&' +
      'workorderid=' + this.project._projectnumber + '&' +
      'workordermod=' + this.project._projectscope + '&' +
      'userfirstname=' + this.user._userfirstname + '&' +
      'userlastname=' + this.user._userlastname + '&' +
      'userposition=' + this.user._userposition + '&' +
      'useremail=' + this.user._useremail + '&' +
      'useraddress=' + this.user._useraddress + '&' +
      'usercity=' + this.user._usercity + '&' +
      'userstateorprovince=' + this.user._userstateorprovince + '&' +
      'userzipcode=' + this.user._userzipcode + '&' +
      'userphonenumber=' + this.user._userphonenumber + '&' +
      'customername=' + this.customer._customername + '&' +
      'requester=' + this._requester + '&' +
      'requesterposition=' + this._requesterposition + '&' +
      'requesteremail=' + this._requesteremail + '&' +
      'address=' + this.customer._address + '&' +
      'city=' + this.customer._city + '&' +
      'stateorprovince=' + this.customer._stateorprovince + '&' +
      'zipcode=' + this.customer._zipcode + '&' +
      'projectnumber=' + this.project._rtProjNum + '&' +
      'projectname=' + this.project._projectname + '&' +
      'subject=' + this._subject + '&' +
      'footer=' + this._footer + '&' +
      'number=' + quotenumber + '&' +
      'today=' + today + '&' +
      'data=' + notes + '&' +
      'companydbname=' + this._dbname + '&' +
      'items=' + quotesitems + '&' +
      'assemblydesc=' + quoteassemblydesc + '&' +
      'amount=' + quoteamount + '&' +
      'daystoexpire=' + daystoexpire + '&' +
      'ptdescription=' + ptdescription

    let base64Str: string = window.btoa(filePath);

    let source = 'quotes';
    let sourceid = this._transactionid;
    let filename = fileName;
    let enteredby = this.user._userid;
    let rt = 'yes';
    let tp = 'yes';

    let params = { p: base64Str, source: source, sourceid: sourceid, filename: filename, enteredby: enteredby, rt: rt, tp: tp };

    let seq = this.api.get('generatepdf', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  GenericWebGeneratePDF(fileName: string, source: string, sourceidrt: string) {

    let filePath: string = 'id=' + this._transactionid + '&' +
      'detailid=' + this._transactiondetailid + '&' +
      'client=' + this._dbname

    let base64Str: string = window.btoa(filePath);

    let sourceid = this._transactionid;
    let filename = fileName;
    let enteredby = this.user._userid;
    let rt = 'yes';
    let tp = 'yes';

    if (sourceidrt == '') {
      rt = 'no';
    }
    //source = 'billing';
    let params = { p: base64Str, source: source, sourceid: sourceid, filename: filename, enteredby: enteredby, rt: rt, tp: tp, sourceidrt: sourceidrt };

    let seq = this.api.get('generatepdf', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  PriorBilling(buyoutlineid: string, transactionid: string) {
    let params = { buyoutlineid: buyoutlineid, transactionid: transactionid };
    let seq = this.api.get('priorbilling', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  SubmitBill(form: any) {
    let params = form;
    let seq = this.api.post('submitbill', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  VerifyTransactionStatus() {
    let params = { transactionid: this._transactionid };
    let seq = this.api.get('verifytransactionstatus', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  SubmitVendorInvoice(form: any) {
    let params = form;
    let seq = this.api.post('submitvendorinvoice', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  VendorInvoiceValidate() {
    let params = { sourceid: this._charsourceid, dbname: this._dbname };
    let seq = this.api.get('vendorinvoicevalidate', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  discounteApps() {

    let params = { userid: this.user._userid, id: this._transactiondetailid, companyid: this.user._usercompanyid };
    let seq = this.api.post('insertcointransaction', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }

  InsertFreeApps(invoiceid: number, invoicenumber: string) {

    let params = { tacompanyid: this.customer._customerid, companyid: this.user._usercompanyid, invoiceid: invoiceid, transactiondetailid: this._transactiondetailid, invoicenumber: invoicenumber };
    let seq = this.api.post('tainsertcointransaction', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;

  }

  BillValidate() {
    let params = { transactionid: this._transactionid };
    let seq = this.api.get('billvalidate', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillDetails() {
    let params = { billid: this._transactiondetailid };
    let seq = this.api.get('billdetails', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  UpdateBill(form: any) {
    let params = form;
    let seq = this.api.put('updatebill', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  EditBillValidate() {
    let params = { billid: this._transactiondetailid };
    let seq = this.api.get('editbillvalidate', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillNumber() {
    let params = { transactionid: this._transactionid };
    let seq = this.api.get('billnumber', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  OpenCommitment(includedraft: number) {
    let params = { transactionid: this._transactionid, includedraft: includedraft };
    let seq = this.api.get('opencommitment', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  getCurrency(amount: number) {
    return this.decimalPipe.transform(amount, '1.2-2');
  }

  getPercent(amount: number) {
    return this.percentPipe.transform(amount, '1.2-2');
  }

  getNumber(amount: any) {
    return Number(amount.toString().replace(/\,+/g, ''));
  }

  getNumberPercent(amount: any) {
    return Number(amount.replace(/[,%]+/g, ''));
  }

  PreviousLineBill(buyoutlineid: any) {
    let params = { buyoutlineid: buyoutlineid, transactionid: this._transactionid };
    let seq = this.api.get('previouslinebill', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  PreviousBill() {
    let params = { transactionid: this._transactionid };
    let seq = this.api.get('previousbill', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillLineValidate(lineid: number) {
    let params = { sourceid: lineid, dbname: this._dbname };
    let seq = this.api.get('linevalidate', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  EmailBillingTemplate() {
    let emailUrl = './email-template.html';
    let params = {};
    let options = { responseType: 'text' }
    let seq = this.api.getRT(emailUrl, params, options).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillingNotification(form: any) {
    let params = form;
    let seq = this.api.post('billingnotification', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  UploadFileBrowser(form: any, url: string) {
    let params = form;
    let seq = this.api.postGeneral(url, params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  RecreateBill(billID: any) {
    let params = { billID: billID, userID: this.user._userid };
    let seq = this.api.post('recreatebill', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillOptions(billID: any) {
    let params = { billid: billID };
    let seq = this.api.get('billoptions', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  BillWarning(billID: any) {
    let params = { billid: billID };
    let seq = this.api.get('billwarning', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  TransactionById(params) {    
    let seq = this.api.get('transactions/transactionid', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  DisputedBill(disputedid: any) {
    let params = { disputedid: disputedid };
    let seq = this.api.get('disputed', params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  removeDuplicates(originalArray, prop) {
		var newArray = [];
		var lookupObject  = {};
   
		for(var i in originalArray) {
		   lookupObject[originalArray[i][prop]] = originalArray[i];
		}
   
		for(i in lookupObject) {
			newArray.push(lookupObject[i]);
		}
		 return newArray;
	}

  CredentialList() {
    let urlCredentials = this.constant.urlCredentials;
    let params = { buyoutID: this._charsourceid, client: this._dbname };
    let seq = this.api.getRT(urlCredentials, params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  WaiverList() {
    let urlWaivers = this.constant.urlWaivers;
    let params = { buyoutID: this._charsourceid, client: this._dbname };
    let seq = this.api.getRT(urlWaivers, params, false).share();

    seq.subscribe((res: any) => {
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  _transactionStorage(item: any) {
    this._transactionid = item ? item.TransactionId : '';
    this._transactiondetailid = item ? item.TransactionDetailId : '';
    this._sourceid = item ? item.SourceID : '';
    this._sourceid = item ? item.SourceID : '';
    this._charsourceid = item ? item.charSourceID : '';
    this._transactiontype = item ? item.TransactionType : '';
    this._transactionnumber = item ? item.TransactionNumber : '';
    this._projectnumber = item ? item.ProjectNumber : '';
    this._subject = item ? item.Subject : '';
    this._status = item ? item.Status : '';
    this._transactionduedate = item ? item.TransactionDueDate : '';
    this._submitteddate = item ? item.SubmittedDate : '';
    this._company = item ? item.Company : '';
    this._dbname = item ? item.DBName : '';
    this._datesdif = item ? item.DatesDif : '';
    this._requester = item ? item.Requester : '';
    this._requesterposition = item ? item.RequesterPosition : '';
    this._amountsubmitted = item ? item.Amount : '';
    this._attachmentname = item ? item.AttachmentName : '';
    this._paymenttermsname = item ? item.PaymentTermsName : '';
    this._paymenttermsduedays = item ? item.PaymentTermsDueDays : '';
    this._requesteremail = item ? item.RequesterEmail : '';
    this._vatvenuevalue = item ? item.VATVenueValue : 0;
    this._taxvenuevalue = item ? item.TaxVenueValue : 0;
    this._retainagevalue = item ? item.RetainageValue : 0;
    this._notes = item ? item.Notes : '';
    this._footer = item ? item.Footer : '';
    this._olddata = item ? item.OldData : '';

    window.localStorage.setItem('transactionid', this._transactionid);
    window.localStorage.setItem('transactiondetailid', this._transactiondetailid);
    window.localStorage.setItem('sourceid', this._sourceid);
    window.localStorage.setItem('charsourceid', this._charsourceid);
    window.localStorage.setItem('transactiontype', this._transactiontype);
    window.localStorage.setItem('transactionnumber', this._transactionnumber);
    window.localStorage.setItem('subject', this._subject);
    window.localStorage.setItem('status', this._status);
    window.localStorage.setItem('transactionduedate', this._transactionduedate);
    window.localStorage.setItem('submitteddate', this._submitteddate);
    window.localStorage.setItem('company', this._company);
    window.localStorage.setItem('dbname', this._dbname);
    window.localStorage.setItem('datesdif', this._datesdif);
    window.localStorage.setItem('requester', this._requester);
    window.localStorage.setItem('requesterposition', this._requesterposition);
    window.localStorage.setItem('amountsubmitted', this._amountsubmitted);
    window.localStorage.setItem('attachmentname', this._attachmentname);
    window.localStorage.setItem('paymenttermsname', this._paymenttermsname);
    window.localStorage.setItem('paymenttermsduedays', this._paymenttermsduedays);
    window.localStorage.setItem('requesteremail', this._requesteremail);
    window.localStorage.setItem('vatvenuevalue', this._vatvenuevalue);
    window.localStorage.setItem('taxvenuevalue', this._taxvenuevalue);
    window.localStorage.setItem('retainagevalue', this._retainagevalue);
    window.localStorage.setItem('notes', this._notes);
    window.localStorage.setItem('footer', this._footer);
    window.localStorage.setItem('olddata', this._olddata);
  }
}
