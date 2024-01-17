var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "@luban/validator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormStore = void 0;
    const react_1 = require("react");
    const validator_1 = __importDefault(require("@luban/validator"));
    class FormStore {
        constructor(defaultData) {
            this.store = {};
            this.defaultStore = {};
            this.entities = {};
            this.groupEntities = {};
            this.groupName = {};
            this.rules = {};
            this.switchStore = [];
            this.getForm = () => ({
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
            this.getListCallbackFunc = (getFormListNames, addList) => {
                this.getFormListNames = getFormListNames;
                this.setFormListItem = addList;
                this.setFormList(getFormListNames());
            };
            this.setFormList = (formListNames) => {
                Object.getOwnPropertyNames(formListNames).forEach((name) => {
                    const value = this.defaultStore[name];
                    if (Array.isArray(value)) {
                        delete this.defaultStore[name];
                        delete this.store[name];
                        value.forEach((val, ind) => {
                            var _a;
                            const key = `${name}_formList_${ind}`;
                            if (ind > 0) {
                                (_a = this.setFormListItem) === null || _a === void 0 ? void 0 : _a.call(this, name);
                            }
                            this.setFormValue({ [key]: val }, true, true);
                        });
                    }
                });
            };
            this.setRules = (name, rule, trigger) => {
                this.rules[name] = { rule, trigger };
            };
            this.setSwitchStore = (data) => {
                this.switchStore = data !== null && data !== void 0 ? data : [];
                this.switchStore.forEach((item) => {
                    this.setVisible(item.visibleRule(this.store[item.name]));
                });
            };
            this.register = (name, callbackFunc) => {
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
            this.unRegister = (name) => {
                delete this.entities[name];
                delete this.store[name];
            };
            this.registerGroup = (name, callbackFunc) => {
                this.groupEntities[name] = callbackFunc;
            };
            this.unRegisterGroup = (name) => {
                delete this.groupEntities[name];
            };
            this.setVisible = (visibleResult) => {
                if (Array.isArray(visibleResult.show)) {
                    visibleResult.show.forEach((it) => {
                        var _a;
                        const groupEntitieItem = this.groupEntities[it];
                        const groupNameItem = this.groupName[it];
                        if (groupEntitieItem !== undefined && groupNameItem !== undefined) {
                            groupEntitieItem.setHide(false);
                            groupNameItem.forEach((name) => {
                                this.store[name] = this.defaultStore[name];
                            });
                        }
                        else if (this.entities[it] !== undefined) {
                            (_a = this.entities[it]) === null || _a === void 0 ? void 0 : _a.setHide(false);
                            this.store[it] = this.defaultStore[it];
                        }
                    });
                }
                if (Array.isArray(visibleResult.hide)) {
                    visibleResult.hide.forEach((it) => {
                        var _a;
                        const groupEntitieItem = this.groupEntities[it];
                        const groupNameItem = this.groupName[it];
                        if (groupEntitieItem !== undefined && groupNameItem !== undefined) {
                            groupEntitieItem.setHide(true);
                            groupNameItem.forEach((name) => {
                                delete this.store[name];
                            });
                        }
                        else if (this.entities[it] !== undefined) {
                            (_a = this.entities[it]) === null || _a === void 0 ? void 0 : _a.setHide(true);
                            delete this.store[it];
                        }
                    });
                }
            };
            this.setFormValue = (value, isDefault = false, outSet = false) => {
                this.store = Object.assign(Object.assign({}, this.store), value);
                if (isDefault) {
                    this.defaultStore = Object.assign(Object.assign({}, this.defaultStore), value);
                }
                Object.keys(value).forEach((name) => {
                    var _a;
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
                        if (!isDefault && (((_a = this.rules[name]) === null || _a === void 0 ? void 0 : _a.trigger) === "onChange" || (displayName !== undefined && ["UploadButton", "UploadButtonLB", "UploadImage", "UploadImageLB", "UploadDrag", "UploadDragLB"].includes(displayName)))) {
                            setTimeout(() => {
                                this.validate([name]);
                            });
                        }
                    }
                });
            };
            this.defaultErrorText = (name) => {
                const itemEntity = this.entities[name];
                if (itemEntity !== undefined) {
                    const { label, displayName } = itemEntity.getLabel();
                    if (displayName !== undefined) {
                        switch (displayName) {
                            case "Input":
                            case "InputNumber":
                            case "InputPassword":
                            case "Textarea":
                                return `请输入${label !== null && label !== void 0 ? label : ""}`;
                            case "UploadButton":
                            case "UploadButtonLB":
                            case "UploadImage":
                            case "UploadImageLB":
                            case "UploadDrag":
                            case "UploadDragLB":
                                return `请上传${label !== null && label !== void 0 ? label : ""}`;
                            default:
                                return `请选择${label !== null && label !== void 0 ? label : ""}`;
                        }
                    }
                }
                return "请按要求填写";
            };
            this.getFormListArrkey = (name) => {
                var _a;
                const [formListName, formListIndex] = name.split("_formList_");
                if (formListIndex === undefined) {
                    return name;
                }
                if (formListName !== undefined && this.getFormListNames !== undefined) {
                    const names = (_a = this.getFormListNames()[formListName]) !== null && _a !== void 0 ? _a : [];
                    return `${formListName}[${names.indexOf(name)}]`;
                }
                return name;
            };
            this.validate = (nameList) => {
                const keys = nameList !== null && nameList !== void 0 ? nameList : Object.keys(this.entities);
                const ruleResult = {};
                const ruleError = {};
                keys.forEach((name) => {
                    var _a, _b;
                    const itemEntity = this.entities[name];
                    if (itemEntity !== undefined && itemEntity.getVisibleStatus()) {
                        try {
                            const indexName = this.getFormListArrkey(name);
                            const { displayName } = itemEntity.getLabel();
                            if (displayName !== undefined && ["UploadButton", "UploadButtonLB", "UploadImage", "UploadImageLB", "UploadDrag", "UploadDragLB"].includes(displayName)) {
                                const progressResult = ((_a = itemEntity.getValue()) !== null && _a !== void 0 ? _a : this.store[name])
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
                                (_b = this.rules[name]) === null || _b === void 0 ? void 0 : _b.rule.forEach((rule) => {
                                    var _a, _b, _c, _d, _e;
                                    if (rule instanceof Object && rule.type === "custom") {
                                        const customResult = rule.validator((_a = itemEntity.getValue()) !== null && _a !== void 0 ? _a : this.store[name]);
                                        if (customResult !== true) {
                                            ruleError[name] = customResult === false ? this.defaultErrorText(name) : customResult;
                                            ruleResult[indexName] = ruleError[name];
                                            throw new Error(ruleResult[indexName]);
                                        }
                                    }
                                    else if (rule instanceof Object && rule.type === "required") {
                                        const customResult = (0, validator_1.default)((_b = itemEntity.getValue()) !== null && _b !== void 0 ? _b : this.store[name], "notEmpty");
                                        if (!customResult) {
                                            ruleError[name] = (_c = rule.message) !== null && _c !== void 0 ? _c : this.defaultErrorText(name);
                                            ruleResult[indexName] = ruleError[name];
                                            throw new Error(ruleResult[indexName]);
                                        }
                                    }
                                    else if (!(0, validator_1.default)((_d = itemEntity.getValue()) !== null && _d !== void 0 ? _d : this.store[name], rule)) {
                                        ruleError[name] = (_e = rule.message) !== null && _e !== void 0 ? _e : this.defaultErrorText(name);
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
            this.setErrorFunc = (ruleResult) => {
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
            this.resetForm = (nameList) => {
                const keys = nameList !== null && nameList !== void 0 ? nameList : Object.keys(this.store);
                keys.forEach((name) => {
                    const itemEntity = this.entities[name];
                    if (this.store[name] !== this.defaultStore[name]) {
                        this.store[name] = this.defaultStore[name];
                        itemEntity === null || itemEntity === void 0 ? void 0 : itemEntity.forceUpdate();
                    }
                    if (itemEntity !== undefined) {
                        itemEntity.setError(undefined);
                    }
                });
            };
            this.getFormValue = (nameList, isInner = false) => {
                const data = {};
                if (nameList === undefined) {
                    Object.getOwnPropertyNames(this.entities).forEach((name) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        const nameSplit = name.split(".");
                        if (nameSplit.length === 1) {
                            const [formListName, formListIndex] = name.split("_formList_");
                            if (formListIndex !== undefined && formListName !== undefined) {
                                const names = (_b = (_a = this.getFormListNames) === null || _a === void 0 ? void 0 : _a.call(this)[formListName]) !== null && _b !== void 0 ? _b : [];
                                const nameLen = (_c = names.length) !== null && _c !== void 0 ? _c : 0;
                                if (data[formListName] === undefined) {
                                    data[formListName] = new Array(nameLen).fill(undefined);
                                }
                                const index = names.indexOf(name);
                                if (index < data[formListName].length && index >= 0) {
                                    data[formListName][index] = !isInner
                                        ? (_e = (_d = this.entities[name]) === null || _d === void 0 ? void 0 : _d.getValue()) !== null && _e !== void 0 ? _e : this.store[name]
                                        : this.store[name];
                                }
                            }
                            else {
                                data[name] = !isInner ? (_g = (_f = this.entities[name]) === null || _f === void 0 ? void 0 : _f.getValue()) !== null && _g !== void 0 ? _g : this.store[name] : this.store[name];
                            }
                        }
                        else if (nameSplit[0] !== undefined && nameSplit[1] !== undefined) {
                            if (data[nameSplit[0]] === undefined) {
                                data[nameSplit[0]] = {};
                            }
                            data[nameSplit[0]] = Object.assign(Object.assign({}, data[nameSplit[0]]), { [nameSplit[1]]: !isInner
                                    ? (_j = (_h = this.entities[name]) === null || _h === void 0 ? void 0 : _h.getValue()) !== null && _j !== void 0 ? _j : this.store[name]
                                    : this.store[name] });
                        }
                    });
                    return data;
                }
                nameList.forEach((name) => {
                    var _a, _b;
                    data[name] = !isInner ? (_b = (_a = this.entities[name]) === null || _a === void 0 ? void 0 : _a.getValue()) !== null && _b !== void 0 ? _b : this.store[name] : this.store[name];
                });
                return data;
            };
            this.submit = () => {
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
    }
    exports.FormStore = FormStore;
    const useForm = (defaultData) => {
        const formRef = (0, react_1.useRef)();
        if (formRef.current === undefined) {
            const formStore = new FormStore(defaultData);
            formRef.current = formStore.getForm();
        }
        return formRef.current;
    };
    exports.default = useForm;
});
//# sourceMappingURL=formStore.js.map