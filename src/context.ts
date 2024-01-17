import _React, {createContext} from "react";
import {FormListStore} from "./formListStore";
import {FormStore} from "./formStore";
import type {FormInstanceType, BaseType, FormGroupPropsType, FormListInstanceType, FormListIndexContextType} from "./interface";

export const FormLayoutContext = createContext<Required<BaseType>>({
    wrapperWidth: "100%",
    labelPosition: "row",
    disabled: false,
    displayLabel: true
});
export const FormStoreContext = createContext<FormInstanceType>(new FormStore().getForm());
export const FormGroupContext = createContext<FormGroupPropsType>({name: ""});
export const FormListContext = createContext<FormListInstanceType>(new FormListStore().getFormList());
export const FormListIndexContext = createContext<FormListIndexContextType>({getIndex: () => 0});
/** form添加标识上下文，暴露出去，方便表单元素特殊处理 */
export const LBFormFlagContext = createContext<boolean>(false);
