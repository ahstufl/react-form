(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormListStore = void 0;
    const react_1 = require("react");
    class FormListStore {
        constructor() {
            this.entities = {};
            this.getFormList = () => ({
                formListAdd: this.formListAdd,
                formListRemove: this.formListRemove,
                formListRegister: this.formListRegister,
                formListUnRegister: this.formListUnRegister,
                getFormListNames: this.getFormListNames
            });
            this.getFormListNames = () => {
                const nameObj = {};
                Object.getOwnPropertyNames(this.entities).forEach((name) => {
                    const entity = this.entities[name];
                    if (entity !== undefined) {
                        nameObj[name] = entity.getNames();
                    }
                });
                return nameObj;
            };
            this.formListRegister = (name, callbackFunc) => {
                this.entities[name] = callbackFunc;
            };
            this.formListUnRegister = (name) => {
                delete this.entities[name];
            };
            this.formListAdd = (name, params) => {
                const itemEntity = this.entities[name];
                if (itemEntity !== undefined) {
                    itemEntity.addItem(params);
                }
            };
            this.formListRemove = (name, index) => {
                const itemEntity = this.entities[name];
                if (itemEntity !== undefined) {
                    itemEntity.removeItem(index);
                }
            };
        }
    }
    exports.FormListStore = FormListStore;
    const useFormList = () => {
        const formListRef = (0, react_1.useRef)(null);
        if (formListRef.current === null) {
            const formStore = new FormListStore();
            formListRef.current = formStore.getFormList();
        }
        return formListRef.current;
    };
    exports.default = useFormList;
});
//# sourceMappingURL=formListStore.js.map