import type { FormInstanceType } from "./interface";
export declare class FormStore {
    private store;
    private defaultStore;
    private entities;
    private groupEntities;
    private groupName;
    private rules;
    private switchStore;
    private getFormListNames;
    private setFormListItem;
    constructor(defaultData?: Record<string, unknown>);
    getForm: () => FormInstanceType;
    private getListCallbackFunc;
    private setFormList;
    private setRules;
    private setSwitchStore;
    private register;
    private unRegister;
    private registerGroup;
    private unRegisterGroup;
    private setVisible;
    private setFormValue;
    private defaultErrorText;
    private getFormListArrkey;
    private validate;
    private setErrorFunc;
    private resetForm;
    private getFormValue;
    private submit;
}
declare const useForm: (defaultData?: Record<string, unknown> | undefined) => FormInstanceType;
export default useForm;
//# sourceMappingURL=formStore.d.ts.map