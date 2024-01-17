var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "@luban/ui-stack", "@luban/ui-utils", "./formStore", "./formListStore", "./context", "./FormItem"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormItem = void 0;
    const react_1 = __importStar(require("react"));
    const ui_stack_1 = __importDefault(require("@luban/ui-stack"));
    const ui_utils_1 = require("@luban/ui-utils");
    const formStore_1 = __importDefault(require("./formStore"));
    const formListStore_1 = __importDefault(require("./formListStore"));
    const context_1 = require("./context");
    const FormItem_1 = __importDefault(require("./FormItem"));
    exports.FormItem = FormItem_1.default;
    const Form = (0, react_1.forwardRef)((props, ref) => {
        const { wrapperWidth = "100%", size = "middle", disabled = false, labelPosition = "row", defaultValue, switchForm, children, displayLabel = true, onError, onFinish } = props;
        const formInstance = (0, formStore_1.default)(defaultValue);
        const formListInstance = (0, formListStore_1.default)();
        const formLayoutValue = (0, react_1.useMemo)(() => ({
            wrapperWidth, disabled, labelPosition, displayLabel
        }), [wrapperWidth, disabled, labelPosition, displayLabel]);
        const submit = (0, react_1.useCallback)((event) => {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            const result = formInstance.submit();
            if (result === true) {
                onFinish === null || onFinish === void 0 ? void 0 : onFinish(formInstance.getFormValue());
            }
            else {
                onError === null || onError === void 0 ? void 0 : onError({ value: formInstance.getFormValue(), errors: result });
            }
        }, [formInstance, onError, onFinish]);
        const reset = (0, react_1.useCallback)((event) => {
            event.preventDefault();
            formInstance.resetForm();
        }, [formInstance]);
        (0, react_1.useImperativeHandle)(ref, () => ({
            setFormValue: (value) => formInstance.setFormValue(value, false, true),
            validate: formInstance.validate,
            resetForm: formInstance.resetForm,
            getFormValue: formInstance.getFormValue,
            submit,
            formListAdd: formListInstance.formListAdd,
            formListRemove: formListInstance.formListRemove
        }));
        (0, react_1.useEffect)(() => {
            formInstance.setSwitchStore(switchForm);
        }, [formInstance, switchForm]);
        (0, react_1.useEffect)(() => {
            formInstance.getListCallbackFunc(formListInstance.getFormListNames, formListInstance.formListAdd);
        }, [formInstance, formListInstance]);
        return (react_1.default.createElement(context_1.LBFormFlagContext.Provider, { value: true },
            react_1.default.createElement("form", { "data-lbui-comp": "form", onSubmit: submit, onReset: reset },
                react_1.default.createElement(ui_utils_1.SizeProvider, { size: size },
                    react_1.default.createElement(context_1.FormStoreContext.Provider, { value: formInstance },
                        react_1.default.createElement(context_1.FormListContext.Provider, { value: formListInstance },
                            react_1.default.createElement(context_1.FormLayoutContext.Provider, { value: formLayoutValue },
                                react_1.default.createElement(ui_stack_1.default, { spacing: 20, direction: "row", itemBasis: "unset" }, children))))))));
    });
    Form.displayName = "Form";
    exports.default = Form;
});
//# sourceMappingURL=Form.js.map