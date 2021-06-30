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
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var MarketOriginal = /** @class */ (function (_super) {
    __extends(MarketOriginal, _super);
    function MarketOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarketOriginal.prototype.open = function (appId) { return cordova(this, "open", { "callbackStyle": "object", "successName": "success", "errorName": "failure" }, arguments); };
    MarketOriginal.prototype.search = function (keyword) { return cordova(this, "search", { "callbackStyle": "object", "successName": "success", "errorName": "failure", "platforms": ["Android"] }, arguments); };
    MarketOriginal.pluginName = "Market";
    MarketOriginal.plugin = "cordova-plugin-market";
    MarketOriginal.pluginRef = "cordova.plugins.market";
    MarketOriginal.repo = "https://github.com/xmartlabs/cordova-plugin-market";
    MarketOriginal.platforms = ["Android", "iOS"];
    return MarketOriginal;
}(IonicNativePlugin));
var Market = new MarketOriginal();
export { Market };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL21hcmtldC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyw4QkFBc0MsTUFBTSxvQkFBb0IsQ0FBQzs7SUEwQjVDLDBCQUFpQjs7OztJQVkzQyxxQkFBSSxhQUFDLEtBQWE7SUFlbEIsdUJBQU0sYUFBQyxPQUFlOzs7Ozs7aUJBdER4QjtFQTJCNEIsaUJBQWlCO1NBQWhDLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb3Jkb3ZhLCBJb25pY05hdGl2ZVBsdWdpbiwgUGx1Z2luIH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9jb3JlJztcbi8qKlxuICogQG5hbWUgTWFya2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIE9wZW5zIGFuIGFwcCdzIHBhZ2UgaW4gdGhlIG1hcmtldCBwbGFjZSAoR29vZ2xlIFBsYXksIEFwcCBTdG9yZSlcbiAqXG4gKiBAdXNhZ2VcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IE1hcmtldCB9IGZyb20gJ0Bpb25pYy1uYXRpdmUvbWFya2V0L25neCc7XG4gKlxuICogY29uc3RydWN0b3IocHJpdmF0ZSBtYXJrZXQ6IE1hcmtldCkgeyB9XG4gKlxuICogLi4uXG4gKlxuICogdGhpcy5tYXJrZXQub3BlbigneW91ci5wYWNrYWdlLm5hbWUnKTtcbiAqXG4gKiBgYGBcbiAqL1xuQFBsdWdpbih7XG4gIHBsdWdpbk5hbWU6ICdNYXJrZXQnLFxuICBwbHVnaW46ICdjb3Jkb3ZhLXBsdWdpbi1tYXJrZXQnLFxuICBwbHVnaW5SZWY6ICdjb3Jkb3ZhLnBsdWdpbnMubWFya2V0JyxcbiAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS94bWFydGxhYnMvY29yZG92YS1wbHVnaW4tbWFya2V0JyxcbiAgcGxhdGZvcm1zOiBbJ0FuZHJvaWQnLCAnaU9TJ11cbn0pXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWFya2V0IGV4dGVuZHMgSW9uaWNOYXRpdmVQbHVnaW4ge1xuXG4gIC8qKlxuICAgKiBPcGVucyBhbiBhcHAgaW4gR29vZ2xlIFBsYXkgLyBBcHAgU3RvcmVcbiAgICogQHBhcmFtIGFwcElkIHtzdHJpbmd9IFBhY2thZ2UgbmFtZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlPGFueT59XG4gICAqL1xuICBAQ29yZG92YSh7XG4gICAgY2FsbGJhY2tTdHlsZTogJ29iamVjdCcsXG4gICAgc3VjY2Vzc05hbWU6ICdzdWNjZXNzJyxcbiAgICBlcnJvck5hbWU6ICdmYWlsdXJlJ1xuICB9KVxuICBvcGVuKGFwcElkOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2ggYXBwcyBieSBrZXl3b3JkXG4gICAqIEBwYXJhbSBrZXl3b3JkIHtzdHJpbmd9IEtleXdvcmRcbiAgICogQHJldHVybiB7UHJvbWlzZTxhbnk+fVxuICAgKi9cbiAgQENvcmRvdmEoe1xuICAgIGNhbGxiYWNrU3R5bGU6ICdvYmplY3QnLFxuICAgIHN1Y2Nlc3NOYW1lOiAnc3VjY2VzcycsXG4gICAgZXJyb3JOYW1lOiAnZmFpbHVyZScsXG4gICAgcGxhdGZvcm1zOiBbJ0FuZHJvaWQnXVxuICB9KVxuICBzZWFyY2goa2V5d29yZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm47XG4gIH1cblxufVxuIl19