import { useRef } from "react";
import validatefunc from "@luban/validator";
export class FormStore {
    store = {};
    defaultStore = {};
    entities = {};
    groupEntities = {};
    groupName = {};
    rules = {};
    switchStore = [];
    getFormListNames;
    setFormListItem;
    constructor(defaultData) {
        if (defaultData !== undefined) {
            Object.getOwnPropertyNames(defaultData).forEach((name) => {
                if (typeof defaultData[name] === "object" && !Array.isArray(defaultData[name])) {
                    const data = defaultData[name];
                    Object.getOwnPropertyNames(data).forEach((realName) => {
                        this.defaultStore[`${name}.${realName}`] = data[realName];
                        this.store[`${name}.${realName}`] = data[realName];
                    });
                }
                else {
                    this.defaultStore[name] = defaultData[name];
                    this.store[name] = defaultData[name];
                }
            });
        }
    }
    getForm = () => ({
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
    getListCallbackFunc = (getFormListNames, addList) => {
        this.getFormListNames = getFormListNames;
        this.setFormListItem = addList;
        this.setFormList(getFormListNames());
    };
    setFormList = (formListNames) => {
        Object.getOwnPropertyNames(formListNames).forEach((name) => {
            const value = this.defaultStore[name];
            if (Array.isArray(value)) {
                delete this.defaultStore[name];
                delete this.store[name];
                value.forEach((val, ind) => {
                    const key = `${name}_formList_${ind}`;
                    if (ind > 0) {
                        this.setFormListItem?.(name);
                    }
                    this.setFormValue({ [key]: val }, true, true);
                });
            }
        });
    };
    setRules = (name, rule, trigger) => {
        this.rules[name] = { rule, trigger };
    };
    setSwitchStore = (data) => {
        this.switchStore = data ?? [];
        this.switchStore.forEach((item) => {
            this.setVisible(item.visibleRule(this.store[item.name]));
        });
    };
    register = (name, callbackFunc) => {
        this.entities[name] = callbackFunc;
        const [firstName, secondName] = name.split(".");
        if (firstName !== undefined && secondName !== undefined) {
            if (this.groupName[firstName] !== undefined) {
                if (!this.groupName[firstName].includes(name)) {
                    this.groupName[firstName].push(name);
                }
            }
            else {
                this.groupName[firstName] = [name];
            }
        }
    };
    unRegister = (name) => {
        delete this.entities[name];
        delete this.store[name];
    };
    registerGroup = (name, callbackFunc) => {
        this.groupEntities[name] = callbackFunc;
    };
    unRegisterGroup = (name) => {
        delete this.groupEntities[name];
    };
    setVisible = (visibleResult) => {
        if (Array.isArray(visibleResult.show)) {
            visibleResult.show.forEach((it) => {
                const groupEntitieItem = this.groupEntities[it];
                const groupNameItem = this.groupName[it];
                if (groupEntitieItem !== undefined && groupNameItem !== undefined) {
                    groupEntitieItem.setHide(false);
                    groupNameItem.forEach((name) => {
                        this.store[name] = this.defaultStore[name];
                    });
                }
                else if (this.entities[it] !== undefined) {
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
                }
                else if (this.entities[it] !== undefined) {
                    this.entities[it]?.setHide(true);
                    delete this.store[it];
                }
            });
        }
    };
    setFormValue = (value, isDefault = false, outSet = false) => {
        this.store = { ...this.store, ...value };
        if (isDefault) {
            this.defaultStore = { ...this.defaultStore, ...value };
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
                const { displayName } = itemEntity.getLabel();
                if (!isDefault && (this.rules[name]?.trigger === "onChange" || (displayName !== undefined && ["UploadButton", "UploadButtonLB", "UploadImage", "UploadImageLB", "UploadDrag", "UploadDragLB"].includes(displayName)))) {
                    setTimeout(() => {
                        this.validate([name]);
                    });
                }
            }
        });
    };
    defaultErrorText = (name) => {
        const itemEntity = this.entities[name];
        if (itemEntity !== undefined) {
            const { label, displayName } = itemEntity.getLabel();
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
    getFormListArrkey = (name) => {
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
    validate = (nameList) => {
        const keys = nameList ?? Object.keys(this.entities);
        const ruleResult = {};
        const ruleError = {};
        keys.forEach((name) => {
            const itemEntity = this.entities[name];
            if (itemEntity !== undefined && itemEntity.getVisibleStatus()) {
                try {
                    const indexName = this.getFormListArrkey(name);
                    const { displayName } = itemEntity.getLabel();
                    if (displayName !== undefined && ["UploadButton", "UploadButtonLB", "UploadImage", "UploadImageLB", "UploadDrag", "UploadDragLB"].includes(displayName)) {
                        const progressResult = (itemEntity.getValue() ?? this.store[name])
                            .filter((item) => item.progress !== undefined);
                        if (progressResult.find((item) => typeof item.progress === "number") !== undefined) {
                            ruleError[name] = "文件正在上传";
                            ruleResult[indexName] = ruleError[name];
                            throw new Error(ruleResult[indexName]);
                        }
                        else if (progressResult.find((item) => item.progress === "上传失败") !== undefined) {
                            ruleError[name] = "存在上传失败文件";
                            ruleResult[indexName] = ruleError[name];
                            throw new Error(ruleResult[indexName]);
                        }
                    }
                    if (this.rules[name] !== undefined) {
                        this.rules[name]?.rule.forEach((rule) => {
                            if (rule instanceof Object && rule.type === "custom") {
                                const customResult = rule.validator(itemEntity.getValue() ?? this.store[name]);
                                if (customResult !== true) {
                                    ruleError[name] = customResult === false ? this.defaultErrorText(name) : customResult;
                                    ruleResult[indexName] = ruleError[name];
                                    throw new Error(ruleResult[indexName]);
                                }
                            }
                            else if (rule instanceof Object && rule.type === "required") {
                                const customResult = validatefunc(itemEntity.getValue() ?? this.store[name], "notEmpty");
                                if (!customResult) {
                                    ruleError[name] = rule.message ?? this.defaultErrorText(name);
                                    ruleResult[indexName] = ruleError[name];
                                    throw new Error(ruleResult[indexName]);
                                }
                            }
                            else if (!validatefunc(itemEntity.getValue() ?? this.store[name], rule)) {
                                ruleError[name] = rule.message ?? this.defaultErrorText(name);
                                ruleResult[indexName] = ruleError[name];
                                throw new Error(ruleResult[indexName]);
                            }
                        });
                    }
                    ruleError[name] = undefined;
                }
                catch (_err) {
                }
            }
        });
        const count = this.setErrorFunc(ruleError);
        return {
            errorCount: count,
            ruleResult
        };
    };
    setErrorFunc = (ruleResult) => {
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
    resetForm = (nameList) => {
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
    getFormValue = (nameList, isInner = false) => {
        const data = {};
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
                        if (index < data[formListName].length && index >= 0) {
                            data[formListName][index] = !isInner
                                ? this.entities[name]?.getValue() ?? this.store[name]
                                : this.store[name];
                        }
                    }
                    else {
                        data[name] = !isInner ? this.entities[name]?.getValue() ?? this.store[name] : this.store[name];
                    }
                }
                else if (nameSplit[0] !== undefined && nameSplit[1] !== undefined) {
                    if (data[nameSplit[0]] === undefined) {
                        data[nameSplit[0]] = {};
                    }
                    data[nameSplit[0]] = {
                        ...data[nameSplit[0]],
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
    submit = () => {
        const { errorCount, ruleResult: validateResult } = this.validate();
        if (errorCount === 0) {
            return true;
        }
        const errArr = Object.getOwnPropertyNames(validateResult).map((name) => ({
            name,
            error: validateResult[name]
        }));
        return errArr;
    };
}
const useForm = (defaultData) => {
    const formRef = useRef();
    if (formRef.current === undefined) {
        const formStore = new FormStore(defaultData);
        formRef.current = formStore.getForm();
    }
    return formRef.current;
};
export default useForm;
//# sourceMappingURL=formStore.js.map