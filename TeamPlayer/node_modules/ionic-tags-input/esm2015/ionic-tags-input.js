import { Component, ChangeDetectorRef, Input, Output, EventEmitter, HostListener, ViewChild, forwardRef, ViewEncapsulation, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Platform, IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const TAG_COLORS = {
    "default": "#4a8bfc",
    "secondary": "#32db64",
    "danger": "#f53d3d",
    "warn": "#ffc125",
    "gray": "#767676",
    "purple": "#7e60ff",
    "dark": "#222",
    "light": "#bcbcbc"
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const CITY_PICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IonTagsInput),
    multi: true
};
class IonTagsInput {
    /**
     * @param {?} plt
     * @param {?} ref
     */
    constructor(plt, ref) {
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
        this.onChange = new EventEmitter();
        this.ionFocus = new EventEmitter();
        this.ionBlur = new EventEmitter();
        this._editTag = '';
        this._tags = [];
        this._isFocus = false;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set color(value) {
        if (TAG_COLORS.hasOwnProperty(value)) {
            this.cssColor = (/** @type {?} */ (TAG_COLORS[value]));
        }
        else {
            this.cssColor = value;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set once(value) {
        if (typeof value === 'string') {
            this._once = true;
        }
        else {
            this._once = value;
        }
    }
    /**
     * @return {?}
     */
    get once() {
        return this._once;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.mode === '') {
            this.plt.ready().then(() => {
                this.initMode();
            });
        }
    }
    /**
     * @return {?}
     */
    keyAddTag() {
        let /** @type {?} */ tagStr = this._editTag.trim();
        if (!this.canEnterAdd)
            return;
        if (!this.verifyTag(tagStr))
            return;
        if (this.once && !this.isOnce(tagStr)) {
            this._editTag = '';
            return;
        }
        this.pushTag(tagStr);
    }
    /**
     * @return {?}
     */
    separatorStrAddTag() {
        const /** @type {?} */ lastIndex = this._editTag.length - 1;
        let /** @type {?} */ tagStr = '';
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
    }
    /**
     * @return {?}
     */
    keyRemoveTag() {
        if (!this.canBackspaceRemove)
            return;
        if (this._editTag === '') {
            this.removeTag(-1);
            this._editTag = '';
        }
    }
    /**
     * @param {?} $index
     * @return {?}
     */
    btnRemoveTag($index) {
        this.removeTag($index);
    }
    /**
     * @param {?} tagStr
     * @return {?}
     */
    verifyTag(tagStr) {
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
    }
    /**
     * @param {?} tagStr
     * @return {?}
     */
    pushTag(tagStr) {
        if (this.maxTags !== -1 && this._tags.length >= this.maxTags) {
            this._editTag = '';
            return;
        }
        this._tags.push(tagStr.trim());
        this.ref.detectChanges();
        this.onChange.emit(this._tags);
        this._editTag = '';
    }
    /**
     * @param {?} $index
     * @return {?}
     */
    removeTag($index) {
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
    }
    /**
     * @param {?} tagStr
     * @return {?}
     */
    isOnce(tagStr) {
        const /** @type {?} */ tags = this._tags;
        return tags.every((e) => {
            return e !== tagStr;
        });
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    _click(ev) {
        if (!this._isFocus) {
        }
        this.focus();
        ev.preventDefault();
        ev.stopPropagation();
    }
    /**
     * @return {?}
     */
    blur() {
        if (this._isFocus) {
            this._isFocus = false;
            this.ionBlur.emit(this._tags);
        }
    }
    /**
     * @return {?}
     */
    focus() {
        if (!this._isFocus) {
            this._isFocus = true;
            this.input.nativeElement.focus();
            this.ionFocus.emit(this._tags);
        }
    }
    /**
     * @param {?} val
     * @return {?}
     */
    writeValue(val) {
        this._tags = val;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChanged = fn;
        this.setValue(this._tags);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} val
     * @return {?}
     */
    setValue(val) {
        this._tags = val;
        if (this._tags) {
            this._onChanged(this._tags);
        }
    }
    /**
     * @return {?}
     */
    initMode() {
        this.mode = this.plt.is('ios') ? 'ios' : this.plt.is('android') ? 'md' : this.plt.is('windows') ? 'mp' : 'md';
    }
}
IonTagsInput.decorators = [
    { type: Component, args: [{
                selector: 'ion-tags-input',
                providers: [CITY_PICKER_VALUE_ACCESSOR],
                template: `
  <div class="iti-tags-wrap">
    <ion-tag  *ngFor="let tag of _tags; let $index = index;"
              [tag]="tag"
              [mode]="mode"
              [color]="cssColor"
              [allowClear]="!hideRemove && !readonly"
              (onClear)="btnRemoveTag($index)">
    </ion-tag>
  </div>
  <input #tagsInput
         [hidden]="readonly"
         [disabled]="readonly"
         class="iti-input" [type]="type"
         [placeholder]="placeholder"
         [(ngModel)]="_editTag"
         (blur)="blur()"
         (keyup.backspace)="keyRemoveTag($event); false"
         (keyup)="separatorStrAddTag()"
         (keyup.enter)="keyAddTag()">
  `,
                host: {
                    'class': 'tit-border-color ion-tags-input',
                    '[style.border-bottom-color]': '_isFocus ? cssColor : null',
                    '[class.active]': '_isFocus',
                    '[class.readonly]': 'readonly'
                },
                encapsulation: ViewEncapsulation.None,
                styles: [`.ion-tags-input{border-bottom:1px solid #e5e5e5;-webkit-transition:border-bottom-color .15s ease;transition:border-bottom-color .15s ease;padding:5px;display:block}.ion-tags-input .iti-tag-color{background-color:#4a8bfc;color:#fff}.ion-tags-input.active{border-bottom-color:#4a8bfc}.ion-tags-input .iti-tag{display:block;float:left;font-family:sans-serif;font-size:1.3rem;font-weight:400;margin-right:5px;margin-bottom:5px;padding:4px 10px;max-height:30px;border-radius:0}.ion-tags-input .iti-tag.iti-tag-ios{border-radius:13px}.ion-tags-input .iti-tag.iti-tag-md{border-radius:4px}.ion-tags-input .iti-input{background:0 0;border:0;color:#777;font-family:sans-serif;font-size:13px;font-weight:400;outline:0;padding:5px;width:80px}.ion-tags-input a.iti-tag-rm::before{content:" x";cursor:pointer;font-weight:700;color:#fff}.ion-tags-input.active.tit-border-color.readonly,.ion-tags-input.tit-border-color.readonly{border:none}`]
            },] },
];
/** @nocollapse */
IonTagsInput.ctorParameters = () => [
    { type: Platform, },
    { type: ChangeDetectorRef, },
];
IonTagsInput.propDecorators = {
    "mode": [{ type: Input },],
    "readonly": [{ type: Input },],
    "hideRemove": [{ type: Input },],
    "maxTags": [{ type: Input },],
    "placeholder": [{ type: Input },],
    "type": [{ type: Input },],
    "separatorStr": [{ type: Input },],
    "canEnterAdd": [{ type: Input },],
    "canBackspaceRemove": [{ type: Input },],
    "verifyMethod": [{ type: Input },],
    "color": [{ type: Input },],
    "once": [{ type: Input },],
    "onChange": [{ type: Output },],
    "ionFocus": [{ type: Output },],
    "ionBlur": [{ type: Output },],
    "input": [{ type: ViewChild, args: ['tagsInput',] },],
    "_click": [{ type: HostListener, args: ['click', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class IonTag {
    constructor() {
        this._color = TAG_COLORS['default'];
        this.allowClear = true;
        this.onClear = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set color(value) {
        if (value !== 'random') {
            this._color = value;
        }
        else {
            const /** @type {?} */ keys = Object.keys(TAG_COLORS);
            const /** @type {?} */ max = keys.length + 1;
            let /** @type {?} */ index = Math.floor(Math.random() * max);
            this._color = (/** @type {?} */ (TAG_COLORS[keys[index]]));
        }
    }
    ;
}
IonTag.decorators = [
    { type: Component, args: [{
                selector: 'ion-tag',
                template: `
  <span>
    {{tag}}
    <a class="iti-tag-rm"
       [hidden]="!allowClear"
       (click)="onClear.emit(tag)"></a>
 </span>
  `,
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
/** @nocollapse */
IonTag.ctorParameters = () => [];
IonTag.propDecorators = {
    "tag": [{ type: Input },],
    "allowClear": [{ type: Input },],
    "mode": [{ type: Input },],
    "onClear": [{ type: Output },],
    "color": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Created by hsuanlee on 2017/4/10.
 */
class IonTagsInputModule {
}
IonTagsInputModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    IonicModule,
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule
                ],
                declarations: [IonTagsInput, IonTag],
                exports: [IonTagsInput, IonTag],
                entryComponents: [IonTagsInput, IonTag]
            },] },
];
/** @nocollapse */
IonTagsInputModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Created by hsuanlee on 2017/4/12.
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { IonTagsInputModule, IonTagsInput, IonTag, TAG_COLORS, CITY_PICKER_VALUE_ACCESSOR as ɵa };
//# sourceMappingURL=ionic-tags-input.js.map
