import type {Validator} from "@luban/validator";
import type {FileInfo, ProgressValue, ResultProps, UploadResultLBProps} from "@luban/ui-upload";

interface FormBase {
    /** 规则校验 */
    validate: (nameList?: string[]) => {ruleResult: Record<string, string | undefined>, errorCount: number};
    /** 重置表单 */
    resetForm: (nameList?: string[]) => void;
}

export interface FormInstanceType extends FormBase {
    /** 提交 */
    submit: () => true | ErrorReturn["errors"];
    /** 规则校验 */
    validate: (nameList?: string[]) => {ruleResult: Record<string, string | undefined>, errorCount: number};
    /** 设置表单元素值 */
    setFormValue: (value: Record<string, unknown>, isDefault?: boolean, outSet?: boolean) => void;
    /** 注册表单事件 */
    register: (name: string, callbackFunc: EntitiesType) => void;
    /** 注册group表单事件 */
    registerGroup: (name: string, callbackFunc: Pick<EntitiesType, "setHide">) => void;
    /** 存储校验规则 */
    setRules: (name: string, rule: Rule[], trigger: ValidateTrigger) => void;
    /** 注销表单事件 */
    unRegister: (name: string) => void;
    /** 注销group表单事件 */
    unRegisterGroup: (name: string) => void;
    /** 存储表单显隐联动配置 */
    setSwitchStore: (data?: SwitchItem[]) => void;
    /** 获取表单元素值 */
    getFormValue: (nameList?: string[], isDefault?: boolean) => Record<string, unknown>;
    /** 设置formList名称回调方法 */
    getListCallbackFunc: (names: () => Record<string, string[]>, add: (name: string) => void) => void;
}

export interface FormRefType extends FormBase, FormListBase {
    /** 表单提交 */
    submit: () => void;
    /** 设置表单元素值 */
    setFormValue: (value: Record<string, unknown>) => void;
    /** 获取表单元素值 */
    getFormValue: (nameList?: string[]) => Record<string, unknown>;
}

export interface BaseType {
    /** 不传入label时是否预留label宽度 */
    displayLabel?: boolean;
    /** 表单元素区域宽度 */
    wrapperWidth?: string | number;
    /** 禁用组件 */
    disabled?: boolean;
    /** 组件label和表单元素之间的布局 */
    labelPosition?: "row" | "column";
}

export interface FormItemStyle {
    labelMarginTop: number;
    resultMaxHeight: number;
}

/** 规则校验 type===custom为自定义校验规则 */
export type Rule = (Validator & {message?: string}) | {type: "required", message?: string} | {type: "custom", validator: (val: unknown) => boolean | string};


/** 规则校验时机，表单元素修改时或者提交时 todo：失焦表单元素暂不支持 */
export type ValidateTrigger = "onChange" | "onBlur";

export interface FormItemPropsType extends BaseType {
    /** 表单元素名称 */
    name?: string;
    /** 表单元素label */
    label?: string;
    /** 表单元素说明 */
    info?: string;
    /** 表单元素默认值 */
    defaultValue?: unknown;
    /** 是否不显示该表单元素 */
    hidden?: boolean;
    /** 是否必填 不传入时使用rules决定 */
    required?: boolean;
    /** 校验规则 */
    rules?: Rule[];
    /** 规则校验时机 */
    validateTrigger?: ValidateTrigger;
    /** 是否显示上传Result组件，仅按钮上传和图片上传有效 */
    showUploadResults?: boolean;
    /** 上传Result组件配置参数, 仅按钮上传和图片上传有效 resultMaxHeight:上传内容区最大高度（滚动展示），默认240 */
    uploadResult?: Omit<ResultProps | UploadResultLBProps, "initialFile"> & {resultMaxHeight?: number};
}

export interface FormGroupPropsType {
    /** 表单组名称 */
    name: string;
    /** 表单组label */
    label?: string;
    /** 是否显示折叠功能,有label的时候有效 */
    showFold?: boolean;
}

/** FormList使用 todo待实现 */
export interface FormListType {
    name: string;
}

export interface SwitchItem {
    /** 监听表单元素名称 */
    name: string;
    /** 校验规则回调 */
    visibleRule: (value: unknown) => ({hide?: string[]; show?: string[]});
}

export interface ErrorReturn {
    /** 错误信息 */
    errors: {name: string, error: string}[];
    /** 表单数据 */
    value: Record<string, unknown>;
}

export interface FormPropsType extends BaseType {
    /** 初始默认值 */
    defaultValue?: Record<string, unknown>;
    /** 表单元素显隐联动 */
    switchForm?: SwitchItem[];
    /** 可设置尺寸的表单元素的尺寸 */
    size?: "large" | "middle" | "small";
    /** 提交成功获取的数据回调 */
    onFinish?: (value: Record<string, unknown>) => void;
    /** 提交失败获取的数据和错误信息 */
    onError?: (data: ErrorReturn) => void;
    children: React.ReactNode;
}

export interface EntitiesType {
    /** 隐藏表单元素 */
    setHide: (hide: boolean) => void;
    /** 设置规则校验文案 */
    setError: (text?: string) => void;
    /** 更新表单元素 */
    forceUpdate: () => void;
    /** 获取表单元素显隐状态 */
    getVisibleStatus: () => boolean;
    /** 获取表单元素label和displayName */
    getLabel: () => {label?: string, displayName?: string}
    /** 按钮上传 图片上传的上传组件Result的ref */
    getValue: () => unknown | undefined;
}

export interface FormListPropsType {
    /** formList名称，替代内部表单元素的name成为表单组的标识，内部的表单元素可以不用写name */
    name: string;
}

export interface ListEntitiesType {
    /** 添加formList内部表单元素，默认加在最后 */
    addItem: (params?: {label?: string; value?: unknown; index?: number;}) => void;
    /** 删除formList内部表单元素，默认删除最后一个 */
    removeItem: (index?: number) => void;
    /** 获取formList内部表单元素的name数组 */
    getNames: () => string[];
}

export interface FormListBase {
    /** FormList新增 */
    formListAdd: (name: string, params?: {label?: string; value?: unknown; index?: number;}) => void;
    /** FormList删除 */
    formListRemove: (name: string, index?: number) => void;
}

export interface FormListInstanceType extends FormListBase {
    /** formList组件注册 */
    formListRegister: (name: string, callbackFunc: ListEntitiesType) => void;
    /** formList组件注销 */
    formListUnRegister: (name: string) => void;
    /** 获取所有formList名称 */
    getFormListNames: () => Record<string, string[]>;
}

export interface FormListIndexContextType{
    /** 获取表单元素在formList中的索引位置（从0开始） */
    getIndex: (data: string) => number
}

export interface FormItemRef {
    /** 从表单元素中获取当前值 */
    value?: unknown;
    /** 获取值回调方法，用于自定义表单获取到封装的内部表单元素值 */
    getValue?: () => unknown;
    /** 兼容上传组件特有获取数据回调方法 */
    getFileInfos?: () => (FileInfo & {progress: ProgressValue})[];
}
