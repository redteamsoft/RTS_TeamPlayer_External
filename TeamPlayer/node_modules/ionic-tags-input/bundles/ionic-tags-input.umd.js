(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('ionic-angular'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define('ionic-tags-input', ['exports', '@angular/core', '@angular/forms', 'ionic-angular', '@angular/common'], factory) :
	(factory((global['ionic-tags-input'] = {}),global.ng.core,global.ng.forms,global.ionicAngular,global.ng.common));
}(this, (function (exports,core,forms,ionicAngular,common) { 'use strict';

var TAG_COLORS = {
    "default": "#4a8bfc",
    "secondary": "#32db64",
    "danger": "#f53d3d",
    "warn": "#ffc125",
    "gray": "#767676",
    "purple": "#7e60ff",
    "dark": "#222",
    "light": "#bcbcbc"
};
var CITY_PICKER_VALUE_ACCESSOR = {
    provide: forms.NG_VALUE_ACCESSOR,
    useExisting: core.forwardRef(function () { return IonTagsInput; }),
    multi: true
};
var IonTagsInput = /** @class */ (function () {
    function IonTagsInput(plt, ref) {
        this.plt = plt;
        this.ref = ref;
        this._once = false;
        this.mode = '';
        this.readonly = false;
        this.hideRemove = false;
        this.maxTags = -1;
        this.placeholder = '+Tag';
        this.type = 'text';
        this.separatorStr = ',';
        this.canEnterAdd = true;
        this.canBackspaceRemove = true;
        this.onChange = new core.EventEmitter();
        this.ionFocus = new core.EventEmitter();
        this.ionBlur = new core.EventEmitter();
        this._editTag = '';
        this._tags = [];
        this._isFocus = false;
    }
    Object.defineProperty(IonTagsInput.prototype, "color", {
        set: function (value) {
            if (TAG_COLORS.hasOwnProperty(value)) {
                this.cssColor = ((TAG_COLORS[value]));
            }
            else {
                this.cssColor = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonTagsInput.prototype, "once", {
        get: function () {
            return this._once;
        },
        set: function (value) {
            if (typeof value === 'string') {
                this._once = true;
            }
            else {
                this._once = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    IonTagsInput.prototype.ngOnInit = function () {
        var _this = this;
        if (this.mode === '') {
            this.plt.ready().then(function () {
                _this.initMode();
            });
        }
    };
    IonTagsInput.prototype.keyAddTag = function () {
        var tagStr = this._editTag.trim();
        if (!this.canEnterAdd)
            return;
        if (!this.verifyTag(tagStr))
            return;
        if (this.once && !this.isOnce(tagStr)) {
            this._editTag = '';
            return;
        }
        this.pushTag(tagStr);
    };
    IonTagsInput.prototype.separatorStrAddTag = function () {
        var lastIndex = this._editTag.length - 1;
        var tagStr = '';
        if (!this.separatorStr)
            return;
        if (this._editTag[lastIndex] === this.separatorStr) {
            tagStr = this._editTag.split(this.separatorStr)[0].trim();
            if (this.verifyTag(tagStr) && this.isOnce(tagStr)) {
                this.pushTag(tagStr);
            }
            else {
                this._editTag = '';
            }
        }
    };
    IonTagsInput.prototype.keyRemoveTag = function () {
        if (!this.canBackspaceRemove)
            return;
        if (this._editTag === '') {
            this.removeTag(-1);
            this._editTag = '';
        }
    };
    IonTagsInput.prototype.btnRemoveTag = function ($index) {
        this.removeTag($index);
    };
    IonTagsInput.prototype.verifyTag = function (tagStr) {
        if (typeof this.verifyMethod === 'function') {
            if (!this.verifyMethod(tagStr)) {
                this._editTag = '';
                return false;
            }
            else {
                return true;
            }
        }
        if (!tagStr.trim()) {
            this._editTag = '';
            return false;
        }
        else {
            return true;
        }
    };
    IonTagsInput.prototype.pushTag = function (tagStr) {
        if (this.maxTags !== -1 && this._tags.length >= this.maxTags) {
            this._editTag = '';
            return;
        }
        this._tags.push(tagStr.trim());
        this.ref.detectChanges();
        this.onChange.emit(this._tags);
        this._editTag = '';
    };
    IonTagsInput.prototype.removeTag = function ($index) {
        if (this._tags.length > 0) {
            if ($index === -1) {
                this._tags.pop();
                this.onChange.emit(this._tags);
            }
            else if ($index > -1) {
                this._tags.splice($index, 1);
                this.onChange.emit(this._tags);
            }
        }
    };
    IonTagsInput.prototype.isOnce = function (tagStr) {
        var tags = this._tags;
        return tags.every(function (e) {
            return e !== tagStr;
        });
    };
    IonTagsInput.prototype._click = function (ev) {
        if (!this._isFocus) {
        }
        this.focus();
        ev.preventDefault();
        ev.stopPropagation();
    };
    IonTagsInput.prototype.blur = function () {
        if (this._isFocus) {
            this._isFocus = false;
            this.ionBlur.emit(this._tags);
        }
    };
    IonTagsInput.prototype.focus = function () {
        if (!this._isFocus) {
            this._isFocus = true;
            this.input.nativeElement.focus();
            this.ionFocus.emit(this._tags);
        }
    };
    IonTagsInput.prototype.writeValue = function (val) {
        this._tags = val;
    };
    IonTagsInput.prototype.registerOnChange = function (fn) {
        this._onChanged = fn;
        this.setValue(this._tags);
    };
    IonTagsInput.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    IonTagsInput.prototype.setValue = function (val) {
        this._tags = val;
        if (this._tags) {
            this._onChanged(this._tags);
        }
    };
    IonTagsInput.prototype.initMode = function () {
        this.mode = this.plt.is('ios') ? 'ios' : this.plt.is('android') ? 'md' : this.plt.is('windows') ? 'mp' : 'md';
    };
    return IonTagsInput;
}());
IonTagsInput.decorators = [
    { type: core.Component, args: [{
                selector: 'ion-tags-input',
                providers: [CITY_PICKER_VALUE_ACCESSOR],
                template: "\n  <div class=\"iti-tags-wrap\">\n    <ion-tag  *ngFor=\"let tag of _tags; let $index = index;\"\n              [tag]=\"tag\"\n              [mode]=\"mode\"\n              [color]=\"cssColor\"\n              [allowClear]=\"!hideRemove && !readonly\"\n              (onClear)=\"btnRemoveTag($index)\">\n    </ion-tag>\n  </div>\n  <input #tagsInput\n         [hidden]=\"readonly\"\n         [disabled]=\"readonly\"\n         class=\"iti-input\" [type]=\"type\"\n         [placeholder]=\"placeholder\"\n         [(ngModel)]=\"_editTag\"\n         (blur)=\"blur()\"\n         (keyup.backspace)=\"keyRemoveTag($event); false\"\n         (keyup)=\"separatorStrAddTag()\"\n         (keyup.enter)=\"keyAddTag()\">\n  ",
                host: {
                    'class': 'tit-border-color ion-tags-input',
                    '[style.border-bottom-color]': '_isFocus ? cssColor : null',
                    '[class.active]': '_isFocus',
                    '[class.readonly]': 'readonly'
                },
                encapsulation: core.ViewEncapsulation.None,
                styles: [".ion-tags-input{border-bottom:1px solid #e5e5e5;-webkit-transition:border-bottom-color .15s ease;transition:border-bottom-color .15s ease;padding:5px;display:block}.ion-tags-input .iti-tag-color{background-color:#4a8bfc;color:#fff}.ion-tags-input.active{border-bottom-color:#4a8bfc}.ion-tags-input .iti-tag{display:block;float:left;font-family:sans-serif;font-size:1.3rem;font-weight:400;margin-right:5px;margin-bottom:5px;padding:4px 10px;max-height:30px;border-radius:0}.ion-tags-input .iti-tag.iti-tag-ios{border-radius:13px}.ion-tags-input .iti-tag.iti-tag-md{border-radius:4px}.ion-tags-input .iti-input{background:0 0;border:0;color:#777;font-family:sans-serif;font-size:13px;font-weight:400;outline:0;padding:5px;width:80px}.ion-tags-input a.iti-tag-rm::before{content:\" x\";cursor:pointer;font-weight:700;color:#fff}.ion-tags-input.active.tit-border-color.readonly,.ion-tags-input.tit-border-color.readonly{border:none}"]
            },] },
];
IonTagsInput.ctorParameters = function () { return [
    { type: ionicAngular.Platform, },
    { type: core.ChangeDetectorRef, },
]; };
IonTagsInput.propDecorators = {
    "mode": [{ type: core.Input },],
    "readonly": [{ type: core.Input },],
    "hideRemove": [{ type: core.Input },],
    "maxTags": [{ type: core.Input },],
    "placeholder": [{ type: core.Input },],
    "type": [{ type: core.Input },],
    "separatorStr": [{ type: core.Input },],
    "canEnterAdd": [{ type: core.Input },],
    "canBackspaceRemove": [{ type: core.Input },],
    "verifyMethod": [{ type: core.Input },],
    "color": [{ type: core.Input },],
    "once": [{ type: core.Input },],
    "onChange": [{ type: core.Output },],
    "ionFocus": [{ type: core.Output },],
    "ionBlur": [{ type: core.Output },],
    "input": [{ type: core.ViewChild, args: ['tagsInput',] },],
    "_click": [{ type: core.HostListener, args: ['click', ['$event'],] },],
};
var IonTag = /** @class */ (function () {
    function IonTag() {
        this._color = TAG_COLORS['default'];
        this.allowClear = true;
        this.onClear = new core.EventEmitter();
    }
    Object.defineProperty(IonTag.prototype, "color", {
        set: function (value) {
            if (value !== 'random') {
                this._color = value;
            }
            else {
                var keys = Object.keys(TAG_COLORS);
                var max = keys.length + 1;
                var index = Math.floor(Math.random() * max);
                this._color = ((TAG_COLORS[keys[index]]));
            }
        },
        enumerable: true,
        configurable: true
    });
    return IonTag;
}());
IonTag.decorators = [
    { type: core.Component, args: [{
                selector: 'ion-tag',
                template: "\n  <span>\n    {{tag}}\n    <a class=\"iti-tag-rm\"\n       [hidden]=\"!allowClear\"\n       (click)=\"onClear.emit(tag)\"></a>\n </span>\n  ",
                host: {
                    'class': 'iti-tag iti-tag-color',
                    '[class.iti-tag-md]': 'mode === "md"',
                    '[class.iti-tag-ios]': 'mode === "ios"',
                    '[class.iti-tag-wp]': 'mode === "wp"',
                    '[style.background-color]': '_color'
                },
                styles: []
            },] },
];
IonTag.ctorParameters = function () { return []; };
IonTag.propDecorators = {
    "tag": [{ type: core.Input },],
    "allowClear": [{ type: core.Input },],
    "mode": [{ type: core.Input },],
    "onClear": [{ type: core.Output },],
    "color": [{ type: core.Input },],
};
var IonTagsInputModule = /** @class */ (function () {
    function IonTagsInputModule() {
    }
    return IonTagsInputModule;
}());
IonTagsInputModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    ionicAngular.IonicModule,
                    common.CommonModule,
                    forms.FormsModule,
                    forms.ReactiveFormsModule
                ],
                declarations: [IonTagsInput, IonTag],
                exports: [IonTagsInput, IonTag],
                entryComponents: [IonTagsInput, IonTag]
            },] },
];
IonTagsInputModule.ctorParameters = function () { return []; };

exports.IonTagsInputModule = IonTagsInputModule;
exports.IonTagsInput = IonTagsInput;
exports.IonTag = IonTag;
exports.TAG_COLORS = TAG_COLORS;
exports.ɵa = CITY_PICKER_VALUE_ACCESSOR;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ionic-tags-input.umd.js.map
