var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var Market = /** @class */ (function (_super) {
    __extends(Market, _super);
    function Market() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Market.prototype.open = function (appId) { return cordova(this, "open", { "callbackStyle": "object", "successName": "success", "errorName": "failure" }, arguments); };
    Market.prototype.search = function (keyword) { return cordova(this, "search", { "callbackStyle": "object", "successName": "success", "errorName": "failure", "platforms": ["Android"] }, arguments); };
    Market.pluginName = "Market";
    Market.plugin = "cordova-plugin-market";
    Market.pluginRef = "cordova.plugins.market";
    Market.repo = "https://github.com/xmartlabs/cordova-plugin-market";
    Market.platforms = ["Android", "iOS"];
    Market = __decorate([
        Injectable()
    ], Market);
    return Market;
}(IonicNativePlugin));
export { Market };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL21hcmtldC9uZ3gvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyw4QkFBc0MsTUFBTSxvQkFBb0IsQ0FBQzs7SUEwQjVDLDBCQUFpQjs7OztJQVkzQyxxQkFBSSxhQUFDLEtBQWE7SUFlbEIsdUJBQU0sYUFBQyxPQUFlOzs7Ozs7SUEzQlgsTUFBTTtRQURsQixVQUFVLEVBQUU7T0FDQSxNQUFNO2lCQTNCbkI7RUEyQjRCLGlCQUFpQjtTQUFoQyxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29yZG92YSwgSW9uaWNOYXRpdmVQbHVnaW4sIFBsdWdpbiB9IGZyb20gJ0Bpb25pYy1uYXRpdmUvY29yZSc7XG4vKipcbiAqIEBuYW1lIE1hcmtldFxuICogQGRlc2NyaXB0aW9uXG4gKiBPcGVucyBhbiBhcHAncyBwYWdlIGluIHRoZSBtYXJrZXQgcGxhY2UgKEdvb2dsZSBQbGF5LCBBcHAgU3RvcmUpXG4gKlxuICogQHVzYWdlXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBNYXJrZXQgfSBmcm9tICdAaW9uaWMtbmF0aXZlL21hcmtldC9uZ3gnO1xuICpcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgbWFya2V0OiBNYXJrZXQpIHsgfVxuICpcbiAqIC4uLlxuICpcbiAqIHRoaXMubWFya2V0Lm9wZW4oJ3lvdXIucGFja2FnZS5uYW1lJyk7XG4gKlxuICogYGBgXG4gKi9cbkBQbHVnaW4oe1xuICBwbHVnaW5OYW1lOiAnTWFya2V0JyxcbiAgcGx1Z2luOiAnY29yZG92YS1wbHVnaW4tbWFya2V0JyxcbiAgcGx1Z2luUmVmOiAnY29yZG92YS5wbHVnaW5zLm1hcmtldCcsXG4gIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20veG1hcnRsYWJzL2NvcmRvdmEtcGx1Z2luLW1hcmtldCcsXG4gIHBsYXRmb3JtczogWydBbmRyb2lkJywgJ2lPUyddXG59KVxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1hcmtldCBleHRlbmRzIElvbmljTmF0aXZlUGx1Z2luIHtcblxuICAvKipcbiAgICogT3BlbnMgYW4gYXBwIGluIEdvb2dsZSBQbGF5IC8gQXBwIFN0b3JlXG4gICAqIEBwYXJhbSBhcHBJZCB7c3RyaW5nfSBQYWNrYWdlIG5hbWVcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIGNhbGxiYWNrU3R5bGU6ICdvYmplY3QnLFxuICAgIHN1Y2Nlc3NOYW1lOiAnc3VjY2VzcycsXG4gICAgZXJyb3JOYW1lOiAnZmFpbHVyZSdcbiAgfSlcbiAgb3BlbihhcHBJZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogU2VhcmNoIGFwcHMgYnkga2V5d29yZFxuICAgKiBAcGFyYW0ga2V5d29yZCB7c3RyaW5nfSBLZXl3b3JkXG4gICAqIEByZXR1cm4ge1Byb21pc2U8YW55Pn1cbiAgICovXG4gIEBDb3Jkb3ZhKHtcbiAgICBjYWxsYmFja1N0eWxlOiAnb2JqZWN0JyxcbiAgICBzdWNjZXNzTmFtZTogJ3N1Y2Nlc3MnLFxuICAgIGVycm9yTmFtZTogJ2ZhaWx1cmUnLFxuICAgIHBsYXRmb3JtczogWydBbmRyb2lkJ11cbiAgfSlcbiAgc2VhcmNoKGtleXdvcmQ6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuO1xuICB9XG5cbn1cbiJdfQ==