/// <reference types="react" />
import type { Validator } from "@luban/validator";
import type { FileInfo, ProgressValue, ResultProps, UploadResultLBProps } from "@luban/ui-upload";
interface FormBase {
    validate: (nameList?: string[]) => {
        ruleResult: Record<string, string | undefined>;
        errorCount: number;
    };
    resetForm: (nameList?: string[]) => void;
}
export interface FormInstanceType extends FormBase {
    submit: () => true | ErrorReturn["errors"];
    validate: (nameList?: string[]) => {
        ruleResult: Record<string, string | undefined>;
        errorCount: number;
    };
    setFormValue: (value: Record<string, unknown>, isDefault?: boolean, outSet?: boolean) => void;
    register: (name: string, callbackFunc: EntitiesType) => void;
    registerGroup: (name: string, callbackFunc: Pick<EntitiesType, "setHide">) => void;
    setRules: (name: string, rule: Rule[], trigger: ValidateTrigger) => void;
    unRegister: (name: string) => void;
    unRegisterGroup: (name: string) => void;
    setSwitchStore: (data?: SwitchItem[]) => void;
    getFormValue: (nameList?: string[], isDefault?: boolean) => Record<string, unknown>;
    getListCallbackFunc: (names: () => Record<string, string[]>, add: (name: string) => void) => void;
}
export interface FormRefType extends FormBase, FormListBase {
    submit: () => void;
    setFormValue: (value: Record<string, unknown>) => void;
    getFormValue: (nameList?: string[]) => Record<string, unknown>;
}
export interface BaseType {
    displayLabel?: boolean;
    wrapperWidth?: string | number;
    disabled?: boolean;
    labelPosition?: "row" | "column";
}
export interface FormItemStyle {
    labelMarginTop: number;
    resultMaxHeight: number;
}
export declare type Rule = (Validator & {
    message?: string;
}) | {
    type: "required";
    message?: string;
} | {
    type: "custom";
    validator: (val: unknown) => boolean | string;
};
export declare type ValidateTrigger = "onChange" | "onBlur";
export interface FormItemPropsType extends BaseType {
    name?: string;
    label?: string;
    info?: string;
    defaultValue?: unknown;
    hidden?: boolean;
    required?: boolean;
    rules?: Rule[];
    validateTrigger?: ValidateTrigger;
    showUploadResults?: boolean;
    uploadResult?: Omit<ResultProps | UploadResultLBProps, "initialFile"> & {
        resultMaxHeight?: number;
    };
}
export interface FormGroupPropsType {
    name: string;
    label?: string;
    showFold?: boolean;
}
export interface FormListType {
    name: string;
}
export interface SwitchItem {
    name: string;
    visibleRule: (value: unknown) => ({
        hide?: string[];
        show?: string[];
    });
}
export interface ErrorReturn {
    errors: {
        name: string;
        error: string;
    }[];
    value: Record<string, unknown>;
}
export interface FormPropsType extends BaseType {
    defaultValue?: Record<string, unknown>;
    switchForm?: SwitchItem[];
    size?: "large" | "middle" | "small";
    onFinish?: (value: Record<string, unknown>) => void;
    onError?: (data: ErrorReturn) => void;
    children: React.ReactNode;
}
export interface EntitiesType {
    setHide: (hide: boolean) => void;
    setError: (text?: string) => void;
    forceUpdate: () => void;
    getVisibleStatus: () => boolean;
    getLabel: () => {
        label?: string;
        displayName?: string;
    };
    getValue: () => unknown | undefined;
}
export interface FormListPropsType {
    name: string;
}
export interface ListEntitiesType {
    addItem: (params?: {
        label?: string;
        value?: unknown;
        index?: number;
    }) => void;
    removeItem: (index?: number) => void;
    getNames: () => string[];
}
export interface FormListBase {
    formListAdd: (name: string, params?: {
        label?: string;
        value?: unknown;
        index?: number;
    }) => void;
    formListRemove: (name: string, index?: number) => void;
}
export interface FormListInstanceType extends FormListBase {
    formListRegister: (name: string, callbackFunc: ListEntitiesType) => void;
    formListUnRegister: (name: string) => void;
    getFormListNames: () => Record<string, string[]>;
}
export interface FormListIndexContextType {
    getIndex: (data: string) => number;
}
export interface FormItemRef {
    value?: unknown;
    getValue?: () => unknown;
    getFileInfos?: () => (FileInfo & {
        progress: ProgressValue;
    })[];
}
export {};
//# sourceMappingURL=interface.d.ts.map