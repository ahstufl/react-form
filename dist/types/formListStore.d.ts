import type { FormListInstanceType } from "./interface";
export declare class FormListStore {
    private entities;
    getFormList: () => FormListInstanceType;
    private getFormListNames;
    private formListRegister;
    private formListUnRegister;
    private formListAdd;
    private formListRemove;
}
declare const useFormList: () => FormListInstanceType;
export default useFormList;
//# sourceMappingURL=formListStore.d.ts.map