import { EventEmitter } from "@angular/core";
export declare class IonTag {
    _color: string;
    tag: string;
    allowClear: boolean;
    mode: 'md' | 'ios' | 'wp';
    onClear: EventEmitter<string>;
    color: string;
}
