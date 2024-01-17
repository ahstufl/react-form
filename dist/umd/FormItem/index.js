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
        define(["require", "exports", "react", "@luban/ui-stack", "@luban/ui-label", "@luban/ui-upload", "@luban/ui-utils", "@luban/style", "../context", "./style"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const react_1 = __importStar(require("react"));
    const ui_stack_1 = __importDefault(require("@luban/ui-stack"));
    const ui_label_1 = __importDefault(require("@luban/ui-label"));
    const ui_upload_1 = require("@luban/ui-upload");
    const ui_utils_1 = require("@luban/ui-utils");
    const style_1 = require("@luban/style");
    const context_1 = require("../context");
    const style_2 = __importDefault(require("./style"));
    const defaultSizeMarginTop = {
        small: 6,
        middle: 10,
        large: 14
    };
    const FormItem = (props) => {
        var _a;
        const { name: realName = "", children, wrapperWidth: itemWrapperWidth, disabled: itemDisabled, labelPosition: itemLabelPosition, label, info, defaultValue: defaultVal, hidden = false, required = false, showUploadResults = true, uploadResult, rules, validateTrigger = "onChange", displayLabel: itemDisplayLabel } = props;
        const defaultSize = (0, ui_utils_1.useDefaultSize)();
        const { setFormValue, getFormValue, register, unRegister, setRules } = (0, react_1.useContext)(context_1.FormStoreContext);
        const { wrapperWidth: formWrapperWidth, disabled: formDisabled, displayLabel: formDisplayLabel, labelPosition: formLabelPosition, } = (0, react_1.useContext)(context_1.FormLayoutContext);
        const { name: groupName } = (0, react_1.useContext)(context_1.FormGroupContext);
        const name = (0, react_1.useMemo)(() => {
            if (groupName !== "") {
                if (realName === "") {
                    return realName;
                }
                return `${groupName}.${realName}`;
            }
            return realName;
        }, [groupName, realName]);
        const { wrapperWidth, disabled, labelPosition, displayLabel } = (0, react_1.useMemo)(() => ({
            wrapperWidth: itemWrapperWidth !== null && itemWrapperWidth !== void 0 ? itemWrapperWidth : formWrapperWidth,
            disabled: itemDisabled !== null && itemDisabled !== void 0 ? itemDisabled : formDisabled,
            labelPosition: itemLabelPosition !== null && itemLabelPosition !== void 0 ? itemLabelPosition : formLabelPosition,
            displayLabel: itemDisplayLabel !== null && itemDisplayLabel !== void 0 ? itemDisplayLabel : formDisplayLabel,
        }), [
            formDisabled,
            formLabelPosition,
            formWrapperWidth,
            formDisplayLabel,
            itemWrapperWidth,
            itemDisabled,
            itemLabelPosition,
            itemDisplayLabel
        ]);
        const [hide, setHide] = (0, react_1.useState)(hidden);
        const [forceUpdateFlag, setForceUpdateFlag] = (0, react_1.useState)(Date.now());
        const [error, setError] = (0, react_1.useState)();
        const uploadResultRef = (0, react_1.useRef)(null);
        const formItemRef = (0, react_1.useRef)(null);
        const defaultValueRef = (0, react_1.useRef)(defaultVal);
        const formObjRef = (0, react_1.useRef)({ hide, label });
        const { contentBox, errorBox, uploadResultContainer, hideUploadResult, rowLabelBox, labelBox, resultMaxHeightStyle } = (0, style_2.default)({
            labelMarginTop: defaultSizeMarginTop[defaultSize],
            resultMaxHeight: (_a = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.resultMaxHeight) !== null && _a !== void 0 ? _a : 240
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
                setFormValue({ [name]: ((_c = displayName === null || displayName === void 0 ? void 0 : displayName.includes("Upload")) !== null && _c !== void 0 ? _c : false) && displayName !== "UploadDrag" && displayName !== "UploadDragLB" ? (_d = uploadResultRef.current) === null || _d === void 0 ? void 0 : _d.getFileInfos() : initValue });
            }
        }, [children, displayName, name, setFormValue]);
        const onUploadRemove = (0, react_1.useCallback)((id, isInit) => {
            var _a, _b;
            if (isInit) {
                setFormValue({ [name]: getFormValue([name], true)[name].filter((item) => item.id !== id) });
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
                        return (react_1.default.createElement("div", { className: (0, style_1.clsx)(uploadResultContainer, resultMaxHeightStyle, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                            react_1.default.createElement(ui_upload_1.UploadResults, Object.assign({}, Object.assign(Object.assign({}, uploadResult), { initialFile: (_a = getFormValue([name], true)[name]) !== null && _a !== void 0 ? _a : defaultVal }), { onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled, id: name }))));
                    case "UploadButtonLB":
                    case "UploadImageLB":
                        return (react_1.default.createElement("div", { className: (0, style_1.clsx)(uploadResultContainer, resultMaxHeightStyle, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                            react_1.default.createElement(ui_upload_1.UploadResultLB, Object.assign({}, uploadResult, { initialFile: ((_b = getFormValue([name], true)[name]) !== null && _b !== void 0 ? _b : defaultVal), onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled, id: name }))));
                    case "UploadDrag":
                    case "UploadDragLB":
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
            uploadResultContainer,
            resultMaxHeightStyle
        ]);
        const childrenFormItem = (0, react_1.useCallback)(() => {
            var _a, _b;
            return children instanceof Object && "props" in children
                && react_1.default.cloneElement(children, Object.assign(Object.assign({}, children.props), { defaultValue: (_a = getFormValue([name], true)[name]) !== null && _a !== void 0 ? _a : defaultVal, initialFile: (_b = getFormValue([name], true)[name]) !== null && _b !== void 0 ? _b : defaultVal, onRemoveFile: onUploadRemove, disabled,
                    onChange, id: name, name, key: forceUpdateFlag, ref: formItemRef }));
        }, [children, getFormValue, name, defaultVal, onUploadRemove, disabled, onChange, forceUpdateFlag]);
        const getVisibleStatus = (0, react_1.useCallback)(() => !formObjRef.current.hide, []);
        const getLabel = (0, react_1.useCallback)(() => ({ label: formObjRef.current.label, displayName: formObjRef.current.displayName }), []);
        const getValue = (0, react_1.useCallback)(() => {
            var _a, _b, _c;
            if (uploadResultRef.current !== null) {
                return uploadResultRef.current.getFileInfos();
            }
            if (formItemRef.current !== null) {
                if ((formObjRef.current.displayName === "UploadDrag" || formObjRef.current.displayName === "UploadDragLB") && formItemRef.current.getFileInfos !== undefined) {
                    return formItemRef.current.getFileInfos();
                }
                return (_c = (_b = (_a = formItemRef.current).getValue) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : formItemRef.current.value;
            }
            return undefined;
        }, []);
        (0, react_1.useEffect)(() => {
            formObjRef.current = Object.assign(Object.assign({}, formObjRef.current), { label,
                hide,
                displayName });
        }, [displayName, hide, label]);
        (0, react_1.useEffect)(() => {
            if (name !== "") {
                register(name, {
                    setHide,
                    forceUpdate,
                    setError,
                    getVisibleStatus,
                    getLabel,
                    getValue
                });
                if (defaultValueRef.current !== undefined && getFormValue([name], true)[name] === undefined && !formObjRef.current.hide) {
                    setFormValue({ [name]: defaultValueRef.current }, true);
                }
                return () => {
                    unRegister(name);
                };
            }
            return undefined;
        }, [forceUpdate, getFormValue, getLabel, getValue, getVisibleStatus, name, register, setFormValue, unRegister]);
        (0, react_1.useEffect)(() => {
            if (name !== "" && (rules !== undefined || required)) {
                setRules(name, required ? ["notEmpty", ...rules !== null && rules !== void 0 ? rules : []] : rules !== null && rules !== void 0 ? rules : [], validateTrigger);
            }
        }, [name, required, rules, setRules, validateTrigger]);
        const hideLabel = (0, react_1.useMemo)(() => {
            if (label === undefined && !displayLabel) {
                return true;
            }
            return false;
        }, [displayLabel, label]);
        const showStar = (0, react_1.useMemo)(() => required || (Array.isArray(rules) && rules.find((item) => item instanceof Object && item.type === "required") !== undefined), [required, rules]);
        if (hide) {
            return null;
        }
        return (react_1.default.createElement(ui_stack_1.default, { direction: labelPosition, spacing: labelPosition === "row" && !hideLabel ? 16 : 8, grow: "unset", width: wrapperWidth, basis: "unset" },
            (labelPosition === "column" || !hideLabel || showStar) && (react_1.default.createElement(ui_stack_1.default, { direction: "row", basis: "unset", width: labelPosition === "row" && (label !== undefined || displayLabel) ? 88 : undefined, align: "start", grow: "unset" },
                react_1.default.createElement("div", { className: (0, style_1.clsx)(labelBox, labelPosition === "row" && rowLabelBox) },
                    react_1.default.createElement(ui_label_1.default, { label: `${label !== null && label !== void 0 ? label : ""}`, required: showStar, width: "100%", align: labelPosition === "row" ? "right" : "left", info: info }),
                    labelPosition === "column" && error !== undefined && error !== "" && react_1.default.createElement("div", { className: (0, style_1.clsx)(errorBox) }, error)))),
            name === "" || Array.isArray(children)
                ? children
                : (react_1.default.createElement(ui_stack_1.default, { align: "center", direction: "row" },
                    react_1.default.createElement("div", { className: contentBox },
                        childrenFormItem(),
                        uploadResults(),
                        labelPosition === "row" && error !== undefined && error !== "" && react_1.default.createElement("div", { className: (0, style_1.clsx)(errorBox) }, error))))));
    };
    FormItem.displayName = "FormItem";
    exports.default = FormItem;
});
//# sourceMappingURL=index.js.map