import { useRef } from "react";
export class FormListStore {
    entities = {};
    getFormList = () => ({
        formListAdd: this.formListAdd,
        formListRemove: this.formListRemove,
        formListRegister: this.formListRegister,
        formListUnRegister: this.formListUnRegister,
        getFormListNames: this.getFormListNames
    });
    getFormListNames = () => {
        const nameObj = {};
        Object.getOwnPropertyNames(this.entities).forEach((name) => {
            const entity = this.entities[name];
            if (entity !== undefined) {
                nameObj[name] = entity.getNames();
            }
        });
        return nameObj;
    };
    formListRegister = (name, callbackFunc) => {
        this.entities[name] = callbackFunc;
    };
    formListUnRegister = (name) => {
        delete this.entities[name];
    };
    formListAdd = (name, params) => {
        const itemEntity = this.entities[name];
        if (itemEntity !== undefined) {
            itemEntity.addItem(params);
        }
    };
    formListRemove = (name, index) => {
        const itemEntity = this.entities[name];
        if (itemEntity !== undefined) {
            itemEntity.removeItem(index);
        }
    };
}
const useFormList = () => {
    const formListRef = useRef(null);
    if (formListRef.current === null) {
        const formStore = new FormListStore();
        formListRef.current = formStore.getFormList();
    }
    return formListRef.current;
};
export default useFormList;
//# sourceMappingURL=formListStore.js.map