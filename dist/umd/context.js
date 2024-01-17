(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "./formListStore", "./formStore"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LBFormFlagContext = exports.FormListIndexContext = exports.FormListContext = exports.FormGroupContext = exports.FormStoreContext = exports.FormLayoutContext = void 0;
    const react_1 = require("react");
    const formListStore_1 = require("./formListStore");
    const formStore_1 = require("./formStore");
    exports.FormLayoutContext = (0, react_1.createContext)({
        wrapperWidth: "100%",
        labelPosition: "row",
        disabled: false,
        displayLabel: true
    });
    exports.FormStoreContext = (0, react_1.createContext)(new formStore_1.FormStore().getForm());
    exports.FormGroupContext = (0, react_1.createContext)({ name: "" });
    exports.FormListContext = (0, react_1.createContext)(new formListStore_1.FormListStore().getFormList());
    exports.FormListIndexContext = (0, react_1.createContext)({ getIndex: () => 0 });
    exports.LBFormFlagContext = (0, react_1.createContext)(false);
});
//# sourceMappingURL=context.js.map