import _React, {useRef} from "react";
import validatefunc from "@luban/validator";
import type {FileInfo, ProgressValue} from "@luban/ui-upload";
import type {FormInstanceType, SwitchItem, EntitiesType, ValidateTrigger, ErrorReturn, Rule} from "./interface";

export class FormStore {
    private store: Record<string, unknown> = {};

    private defaultStore: Record<string, unknown> = {};

    private entities: Record<string, EntitiesType> = {};

    private groupEntities: Record<string, Pick<EntitiesType, "setHide">> = {};

    private groupName: Record<string, string[]> = {};

    private rules: Record<string, {rule: Rule[], trigger: ValidateTrigger}> = {};

    private switchStore: SwitchItem[] = [];

    private getFormListNames: (() => Record<string, string[]>) | undefined;

    private setFormListItem: ((name: string) => void) | undefined;

    constructor(defaultData?: Record<string, unknown>) {
        if (defaultData !== undefined) {
            Object.getOwnPropertyNames(defaultData).forEach((name) => {
                if (typeof defaultData[name] === "object" && !Array.isArray(defaultData[name])) {
                    const data = defaultData[name] as Record<string, unknown>;
                    Object.getOwnPropertyNames(data).forEach((realName) => {
                        this.defaultStore[`${name}.${realName}`] = data[realName];
                        this.store[`${name}.${realName}`] = data[realName];
                    });
                } else {
                    this.defaultStore[name] = defaultData[name];
                    this.store[name] = defaultData[name];
                }
            });
        }
    }

    public getForm = (): FormInstanceType => ({
        setFormValue: this.setFormValue,
        validate: this.validate,
        resetForm: this.resetForm,
        getFormValue: this.getFormValue,
        submit: this.submit,
        register: this.register,
        unRegister: this.unRegister,
        registerGroup: this.registerGroup,
        unRegisterGroup: this.unRegisterGroup,
        setSwitchStore: this.setSwitchStore,
        setRules: this.setRules,
        getListCallbackFunc: this.getListCallbackFunc
    });

    private getListCallbackFunc = (getFormListNames: () => Record<string, string[]>, addList: (name: string) => void) => {
        this.getFormListNames = getFormListNames;
        this.setFormListItem = addList;
        this.setFormList(getFormListNames());
    };

    private setFormList = (formListNames: Record<string, string[]>) => {
        Object.getOwnPropertyNames(formListNames).forEach((name) => {
            const value = this.defaultStore[name];
            if (Array.isArray(value)) {
                delete this.defaultStore[name];
                delete this.store[name];
                (value as unknown[]).forEach((val, ind) => {
                    const key = `${name}_formList_${ind}`;
                    if (ind > 0) {
                        this.setFormListItem?.(name);
                    }
                    this.setFormValue({[key]: val}, true, true);
                });
            }
        });
    };

    private setRules = (name: string, rule: Rule[], trigger: ValidateTrigger) => {
        this.rules[name] = {rule, trigger};
    };

    private setSwitchStore = (data?: SwitchItem[]) => {
        this.switchStore = data ?? [];
        this.switchStore.forEach((item) => {
            this.setVisible(item.visibleRule(this.store[item.name]));
        });
    };

    private register = (name: string, callbackFunc: EntitiesType) => {
        this.entities[name] = callbackFunc;
        const [firstName, secondName] = name.split(".");
        if (firstName !== undefined && secondName !== undefined) {
            if (this.groupName[firstName] !== undefined) {
                if (!this.groupName[firstName]!.includes(name)) {
                    this.groupName[firstName]!.push(name);
                }
            } else {
                this.groupName[firstName] = [name];
            }
        }
    };

    private unRegister = (name: string) => {
        delete this.entities[name];
        delete this.store[name];
    };

    private registerGroup = (name: string, callbackFunc: Pick<EntitiesType, "setHide">) => {
        this.groupEntities[name] = callbackFunc;
    };

    private unRegisterGroup = (name: string) => {
        delete this.groupEntities[name];
    };

    private setVisible = (visibleResult: {
        hide?: string[] | undefined;
        show?: string[] | undefined;
    }) => {
        if (Array.isArray(visibleResult.show)) {
            visibleResult.show.forEach((it) => {
                const groupEntitieItem = this.groupEntities[it];
                const groupNameItem = this.groupName[it];
                if (groupEntitieItem !== undefined && groupNameItem !== undefined) {
                    groupEntitieItem.setHide(false);
                    groupNameItem.forEach((name) => {
                        this.store[name] = this.defaultStore[name];
                    });
                } else if (this.entities[it] !== undefined) {
                    this.entities[it]?.setHide(false);
                    this.store[it] = this.defaultStore[it];
                }
            });
        }
        if (Array.isArray(visibleResult.hide)) {
            visibleResult.hide.forEach((it) => {
                const groupEntitieItem = this.groupEntities[it];
                const groupNameItem = this.groupName[it];
                if (groupEntitieItem !== undefined && groupNameItem !== undefined) {
                    groupEntitieItem.setHide(true);
                    groupNameItem.forEach((name) => {
                        delete this.store[name];
                    });
                } else if (this.entities[it] !== undefined) {
                    this.entities[it]?.setHide(true);
                    delete this.store[it];
                }
            });
        }
    };

    private setFormValue = (value: Record<string, unknown>, isDefault = false, outSet = false) => {
        this.store = {...this.store, ...value};
        if (isDefault) {
            this.defaultStore = {...this.defaultStore, ...value};
        }
        Object.keys(value).forEach((name) => {
            const itemEntity = this.entities[name];
            if (outSet && itemEntity !== undefined) {
                itemEntity.forceUpdate();
            }
            this.switchStore.forEach((item) => {
                if (item.name === name) {
                    this.setVisible(item.visibleRule(value[name]));
                }
            });
            if (itemEntity !== undefined) {
                const {displayName} = itemEntity.getLabel();
                if (!isDefault && (
                    this.rules[name]?.trigger === "onChange" || (displayName !== undefined && ["UploadButton", "UploadButtonLB", "UploadImage", "UploadImageLB", "UploadDrag", "UploadDragLB"].includes(displayName)))
                ) {
                    setTimeout(() => {
                        this.validate([name]);
                    });
                }
            }
        });
    };

    private defaultErrorText = (name: string) => {
        const itemEntity = this.entities[name];
        if (itemEntity !== undefined) {
            const {label, displayName} = itemEntity.getLabel();
            if (displayName !== undefined) {
                switch (displayName) {
                    case "Input":
                    case "InputNumber":
                    case "InputPassword":
                    case "Textarea":
                        return `请输入${label ?? ""}`;
                    case "UploadButton":
                    case "UploadButtonLB":
                    case "UploadImage":
                    case "UploadImageLB":
                    case "UploadDrag":
                    case "UploadDragLB":
                        return `请上传${label ?? ""}`;
                    default:
                        return `请选择${label ?? ""}`;
                }
            }
        }
        return "请按要求填写";
    };

    private getFormListArrkey = (name: string) => {
        const [formListName, formListIndex] = name.split("_formList_");
        if (formListIndex === undefined) {
            return name;
        }
        if (formListName !== undefined && this.getFormListNames !== undefined) {
            const names = this.getFormListNames()[formListName] ?? [];
            return `${formListName}[${names.indexOf(name)}]`;
        }
        return name;
    };

    private validate = (nameList?: string[]) => {
        const keys = nameList ?? Object.keys(this.entities);
        const ruleResult: Record<string, string | undefined> = {};
        const ruleError: Record<string, string | undefined> = {};
        keys.forEach((name) => {
            const itemEntity = this.entities[name];
            if (itemEntity !== undefined && itemEntity.getVisibleStatus()) {
                try {
                    const indexName = this.getFormListArrkey(name);
                    const {displayName} = itemEntity.getLabel();
                    if (displayName !== undefined && ["UploadButton", "UploadButtonLB", "UploadImage", "UploadImageLB", "UploadDrag", "UploadDragLB"].includes(displayName)) {
                        const progressResult = ((itemEntity.getValue() ?? this.store[name]) as (FileInfo & {
                            progress: ProgressValue
                        })[])
                            .filter((item) => item.progress !== undefined);
                        if (progressResult.find((item) => typeof item.progress === "number") !== undefined) {
                            ruleError[name] = "文件正在上传";
                            ruleResult[indexName] = ruleError[name];
                            throw new Error(ruleResult[indexName]);
                        } else if (progressResult.find((item) => item.progress === "上传失败") !== undefined) {
                            ruleError[name] = "存在上传失败文件";
                            ruleResult[indexName] = ruleError[name];
                            throw new Error(ruleResult[indexName]);
                        }
                    }
                    if (this.rules[name] !== undefined) {
                        this.rules[name]?.rule.forEach((rule: Rule) => {
                            if (rule instanceof Object && rule.type === "custom") {
                                const customResult = rule.validator(itemEntity.getValue() ?? this.store[name]);
                                if (customResult !== true) {
                                    ruleError[name] = customResult === false ? this.defaultErrorText(name) : customResult;
                                    ruleResult[indexName] = ruleError[name];
                                    throw new Error(ruleResult[indexName]);
                                }
                            } else if (rule instanceof Object && rule.type === "required") {
                                const customResult = validatefunc(itemEntity.getValue() ?? this.store[name], "notEmpty");
                                if (!customResult) {
                                    ruleError[name] = rule.message ?? this.defaultErrorText(name);
                                    ruleResult[indexName] = ruleError[name];
                                    throw new Error(ruleResult[indexName]);
                                }
                            } else if (!validatefunc(itemEntity.getValue() ?? this.store[name], rule)) {
                                ruleError[name] = rule.message ?? this.defaultErrorText(name);
                                ruleResult[indexName] = ruleError[name];
                                throw new Error(ruleResult[indexName]);
                            }
                        });
                    }
                    ruleError[name] = undefined;
                } catch (_err) {
                    /* empty */
                }
            }
        });
        const count = this.setErrorFunc(ruleError);
        return {
            errorCount: count,
            ruleResult
        };
    };

    private setErrorFunc = (ruleResult: Record<string, string | undefined>) => {
        let errorCount = 0;
        Object.getOwnPropertyNames(ruleResult).forEach((name) => {
            const itemEntity = this.entities[name];
            if (itemEntity !== undefined) {
                itemEntity.setError(ruleResult[name]);
                if (ruleResult[name] !== undefined) {
                    errorCount++;
                }
            }
        });
        return errorCount;
    };

    private resetForm = (nameList?: string[]) => {
        const keys = nameList ?? Object.keys(this.store);
        keys.forEach((name) => {
            const itemEntity = this.entities[name];
            if (this.store[name] !== this.defaultStore[name]) {
                this.store[name] = this.defaultStore[name];
                itemEntity?.forceUpdate();
            }
            if (itemEntity !== undefined) {
                itemEntity.setError(undefined);
            }
        });
    };

    private getFormValue = (nameList?: string[], isInner = false) => {
        const data: Record<string, unknown> = {};
        if (nameList === undefined) {
            Object.getOwnPropertyNames(this.entities).forEach((name) => {
                const nameSplit = name.split(".");
                if (nameSplit.length === 1) {
                    const [formListName, formListIndex] = name.split("_formList_");
                    if (formListIndex !== undefined && formListName !== undefined) {
                        const names = this.getFormListNames?.()[formListName] ?? [];
                        const nameLen = names.length ?? 0;
                        if (data[formListName] === undefined) {
                            data[formListName] = new Array(nameLen).fill(undefined);
                        }
                        const index = names.indexOf(name);
                        if (index < (data[formListName] as unknown[]).length && index >= 0) {
                            (data[formListName] as unknown[])[index] = !isInner
                                ? this.entities[name]?.getValue() ?? this.store[name]
                                : this.store[name];
                        }
                    } else {
                        data[name] = !isInner ? this.entities[name]?.getValue() ?? this.store[name] : this.store[name];
                    }
                } else if (nameSplit[0] !== undefined && nameSplit[1] !== undefined) {
                    if (data[nameSplit[0]] === undefined) {
                        data[nameSplit[0]] = {};
                    }
                    data[nameSplit[0]] = {
                        ...(data[nameSplit[0]] as Record<string, unknown>),
                        [nameSplit[1]]: !isInner
                            ? this.entities[name]?.getValue() ?? this.store[name]
                            : this.store[name]
                    };
                }
            });
            return data;
        }
        nameList.forEach((name) => {
            data[name] = !isInner ? this.entities[name]?.getValue() ?? this.store[name] : this.store[name];
        });
        return data;
    };

    private submit = () => {
        const {errorCount, ruleResult: validateResult} = this.validate();
        if (errorCount === 0) {
            return true;
        }
        const errArr: ErrorReturn["errors"] = Object.getOwnPropertyNames(validateResult).map((name) => ({
            name,
            error: validateResult[name]!
        }));
        return errArr;
    };
}

const useForm = (defaultData?: Record<string, unknown>) => {
    const formRef = useRef<FormInstanceType>();
    if (formRef.current === undefined) {
        const formStore = new FormStore(defaultData);
        formRef.current = formStore.getForm();
    }
    return formRef.current;
};

export default useForm;
