import _React, {useRef} from "react";
import type {FormListInstanceType, ListEntitiesType} from "./interface";

export class FormListStore {
    private entities: Record<string, ListEntitiesType> = {};

    public getFormList = (): FormListInstanceType => ({
        formListAdd: this.formListAdd,
        formListRemove: this.formListRemove,
        formListRegister: this.formListRegister,
        formListUnRegister: this.formListUnRegister,
        getFormListNames: this.getFormListNames
    });

    private getFormListNames = () => {
        const nameObj: Record<string, string[]> = {};
        Object.getOwnPropertyNames(this.entities).forEach((name) => {
            const entity = this.entities[name];
            if (entity !== undefined) {
                nameObj[name] = entity.getNames();
            }
        });
        return nameObj;
    };

    private formListRegister = (name: string, callbackFunc: ListEntitiesType) => {
        this.entities[name] = callbackFunc;
    };

    private formListUnRegister = (name: string) => {
        delete this.entities[name];
    };

    private formListAdd = (name: string, params?: {label?: string; value?: unknown; index?: number}) => {
        const itemEntity = this.entities[name];
        if (itemEntity !== undefined) {
            itemEntity.addItem(params);
        }
    };

    private formListRemove = (name: string, index?: number) => {
        const itemEntity = this.entities[name];
        if (itemEntity !== undefined) {
            itemEntity.removeItem(index);
        }
    };
}

const useFormList = () => {
    const formListRef = useRef<FormListInstanceType | null>(null);
    if (formListRef.current === null) {
        const formStore = new FormListStore();
        formListRef.current = formStore.getFormList();
    }
    return formListRef.current;
};

export default useFormList;
