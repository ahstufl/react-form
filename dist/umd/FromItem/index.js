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
        define(["require", "exports", "react", "@luban/ui-stack", "@luban/ui-label", "@luban/ui-upload", "@luban/style", "../context", "./style"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const react_1 = __importStar(require("react"));
    const ui_stack_1 = __importStar(require("@luban/ui-stack"));
    const ui_label_1 = __importDefault(require("@luban/ui-label"));
    const ui_upload_1 = require("@luban/ui-upload");
    const style_1 = require("@luban/style");
    const context_1 = require("../context");
    const style_2 = __importDefault(require("./style"));
    const FormItem = (props) => {
        const { name = "", children, itemSpacing, labelWidth: itemLabelWidth, labelGrow: itemLabelGrow, wrapperWidth: itemWrapperWidth, wrapperGrow: itemWrapperGrow, disabled: itemDisabled, labelAlign: itemLabelAlign, direction: itemDirection, colon: itemColon, label, labelDispaly = false, defaultValue: defaultVal, hidden = false, required = false, showUploadResults = true, uploadResult, rules, normalize } = props;
        const { setFormValue, getFormValue, register, unRegister, setRules } = (0, react_1.useContext)(context_1.FormStoreContext);
        const { itemSpacing: formItemSpacing, labelWidth: formLabelWidth, labelGrow: formLabelGrow, wrapperGrow: formWrapperGrow, wrapperWidth: formWrapperWidth, labelAlign: formLabelAlign, disabled: formDisabled, direction: formDirection, colon: formColon } = (0, react_1.useContext)(context_1.FormLayoutContext);
        const { spacing, labelWidth, labelGrow, wrapperGrow, wrapperWidth, labelAlign, disabled, direction, colon } = (0, react_1.useMemo)(() => ({
            spacing: itemSpacing !== null && itemSpacing !== void 0 ? itemSpacing : formItemSpacing,
            labelWidth: itemLabelWidth !== null && itemLabelWidth !== void 0 ? itemLabelWidth : formLabelWidth,
            wrapperWidth: itemWrapperWidth !== null && itemWrapperWidth !== void 0 ? itemWrapperWidth : formWrapperWidth,
            labelGrow: itemLabelGrow !== null && itemLabelGrow !== void 0 ? itemLabelGrow : formLabelGrow,
            wrapperGrow: itemWrapperGrow !== null && itemWrapperGrow !== void 0 ? itemWrapperGrow : formWrapperGrow,
            labelAlign: itemLabelAlign !== null && itemLabelAlign !== void 0 ? itemLabelAlign : formLabelAlign,
            disabled: itemDisabled !== null && itemDisabled !== void 0 ? itemDisabled : formDisabled,
            direction: itemDirection !== null && itemDirection !== void 0 ? itemDirection : formDirection,
            colon: itemColon !== null && itemColon !== void 0 ? itemColon : formColon
        }), [
            formDisabled,
            formDirection,
            formLabelAlign,
            formLabelGrow,
            formItemSpacing,
            formLabelWidth,
            formWrapperWidth,
            formColon,
            formWrapperGrow,
            itemWrapperWidth,
            itemDisabled,
            itemLabelAlign,
            itemLabelGrow,
            itemSpacing,
            itemLabelWidth,
            itemDirection,
            itemWrapperGrow,
            itemColon
        ]);
        const [hide, setHide] = (0, react_1.useState)(hidden);
        const [forceUpdateFlag, setForceUpdateFlag] = (0, react_1.useState)(Date.now());
        const [error, setError] = (0, react_1.useState)();
        const uploadResultRef = (0, react_1.useRef)(null);
        const { contentBox, errorBox, uploadResultContainer, hideUploadResult } = (0, style_2.default)({
            wrapperWidth
        });
        const displayName = (0, react_1.useMemo)(() => {
            if (name !== "" && !Array.isArray(children) && children instanceof Object) {
                return children.type.displayName;
            }
            return undefined;
        }, [children, name]);
        const onChange = (0, react_1.useCallback)((initValue) => {
            var _a, _b, _c, _d;
            if (name !== "") {
                if (children instanceof Object && "props" in children) {
                    (_b = (_a = children.props).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, initValue);
                }
                let value = ((_c = displayName === null || displayName === void 0 ? void 0 : displayName.includes("Upload")) !== null && _c !== void 0 ? _c : false) && displayName !== "UploadDrag" ? (_d = uploadResultRef.current) === null || _d === void 0 ? void 0 : _d.getFileInfos() : initValue;
                if (normalize !== undefined) {
                    value = normalize(initValue);
                }
                setFormValue({ [name]: value });
            }
        }, [children, displayName, name, normalize, setFormValue]);
        const onUploadRemove = (0, react_1.useCallback)((id, isInit) => {
            var _a, _b;
            if (isInit) {
                setFormValue({ [name]: getFormValue([name])[name].filter((item) => item.id !== id) });
            }
            if (children instanceof Object && "props" in children) {
                (_b = (_a = children.props).onRemoveFile) === null || _b === void 0 ? void 0 : _b.call(_a, id, isInit);
            }
        }, [children, getFormValue, name, setFormValue]);
        const forceUpdate = (0, react_1.useCallback)(() => {
            setForceUpdateFlag(Date.now());
        }, []);
        const uploadResults = (0, react_1.useCallback)(() => {
            var _a, _b;
            if (children instanceof Object) {
                switch (displayName) {
                    case "UploadButton":
                    case "UploadImage":
                        return (react_1.default.createElement("div", { className: (0, style_1.clsx)(uploadResultContainer, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                            react_1.default.createElement(ui_upload_1.UploadResults, Object.assign({}, Object.assign(Object.assign({}, uploadResult), { initialFile: (_a = getFormValue([name])[name]) !== null && _a !== void 0 ? _a : defaultVal }), { onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled }))));
                    case "UploadButtonLB":
                    case "UploadImageLB":
                        return (react_1.default.createElement("div", { className: (0, style_1.clsx)(uploadResultContainer, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                            react_1.default.createElement(ui_upload_1.UploadResultLB, Object.assign({}, uploadResult, { initialFile: ((_b = getFormValue([name])[name]) !== null && _b !== void 0 ? _b : defaultVal), onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled }))));
                    case "UploadDrag":
                    case "UploadDragLB":
                        break;
                    default:
                        return undefined;
                }
            }
            return undefined;
        }, [
            disabled,
            children,
            defaultVal,
            displayName,
            forceUpdateFlag,
            getFormValue,
            hideUploadResult,
            name,
            onUploadRemove,
            showUploadResults,
            uploadResult,
            uploadResultContainer
        ]);
        const childrenFormItem = (0, react_1.useCallback)(() => {
            var _a, _b;
            return children instanceof Object && "props" in children
                && react_1.default.cloneElement(children, Object.assign(Object.assign({}, children.props), { defaultValue: (_a = getFormValue([name])[name]) !== null && _a !== void 0 ? _a : defaultVal, initialFile: (_b = getFormValue([name])[name]) !== null && _b !== void 0 ? _b : defaultVal, onRemoveFile: onUploadRemove, disabled,
                    onChange, key: forceUpdateFlag }));
        }, [children, getFormValue, name, defaultVal, onUploadRemove, disabled, onChange, forceUpdateFlag]);
        const getVisibleStatus = (0, react_1.useCallback)(() => !hide, [hide]);
        const getLabel = (0, react_1.useCallback)(() => ({ label, displayName }), [displayName, label]);
        (0, react_1.useEffect)(() => {
            if (name !== "") {
                register(name, { setHide, forceUpdate, setError, getVisibleStatus, getLabel });
                if (rules !== undefined || required) {
                    setRules(name, required ? ["notEmpty", ...rules !== null && rules !== void 0 ? rules : []] : rules !== null && rules !== void 0 ? rules : []);
                }
                if (defaultVal !== undefined && getFormValue([name])[name] === undefined && !hide) {
                    setFormValue({ [name]: defaultVal }, true);
                }
                return () => {
                    unRegister(name);
                };
            }
            return undefined;
        }, [
            hide,
            defaultVal,
            forceUpdate,
            getFormValue,
            getLabel,
            getVisibleStatus,
            name,
            register,
            required,
            rules,
            setFormValue,
            setRules,
            unRegister
        ]);
        if (hide) {
            return null;
        }
        return (react_1.default.createElement(ui_stack_1.default, { direction: label !== undefined || required ? direction : "row", spacing: spacing, width: "100%" },
            label === undefined && !labelDispaly
                ? required && (react_1.default.createElement(ui_stack_1.StackItem, { grow: "0" },
                    react_1.default.createElement(ui_label_1.default, { required: true, width: 10 })))
                : (react_1.default.createElement(ui_stack_1.default, { direction: "row", grow: labelGrow, basis: "unset", width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth, align: "start" },
                    react_1.default.createElement(ui_label_1.default, { label: `${label !== null && label !== void 0 ? label : ""}${colon ? ":" : ""}`, required: required, width: "100%", align: labelAlign }))),
            name === "" || Array.isArray(children)
                ? children
                : (react_1.default.createElement(ui_stack_1.StackItem, { grow: wrapperGrow },
                    react_1.default.createElement("div", { className: contentBox },
                        childrenFormItem(),
                        uploadResults(),
                        error !== undefined && error !== "" && react_1.default.createElement("div", { className: (0, style_1.clsx)(errorBox) }, error))))));
    };
    exports.default = FormItem;
});
//# sourceMappingURL=index.js.map