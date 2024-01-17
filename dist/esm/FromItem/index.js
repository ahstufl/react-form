import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import Stack, { StackItem } from "@luban/ui-stack";
import Label from "@luban/ui-label";
import { UploadResults, UploadResultLB } from "@luban/ui-upload";
import { clsx } from "@luban/style";
import { FormStoreContext, FormLayoutContext } from "../context";
import useStyle from "./style";
const FormItem = (props) => {
    const { name = "", children, itemSpacing, labelWidth: itemLabelWidth, labelGrow: itemLabelGrow, wrapperWidth: itemWrapperWidth, wrapperGrow: itemWrapperGrow, disabled: itemDisabled, labelAlign: itemLabelAlign, direction: itemDirection, colon: itemColon, label, labelDispaly = false, defaultValue: defaultVal, hidden = false, required = false, showUploadResults = true, uploadResult, rules, normalize } = props;
    const { setFormValue, getFormValue, register, unRegister, setRules } = useContext(FormStoreContext);
    const { itemSpacing: formItemSpacing, labelWidth: formLabelWidth, labelGrow: formLabelGrow, wrapperGrow: formWrapperGrow, wrapperWidth: formWrapperWidth, labelAlign: formLabelAlign, disabled: formDisabled, direction: formDirection, colon: formColon } = useContext(FormLayoutContext);
    const { spacing, labelWidth, labelGrow, wrapperGrow, wrapperWidth, labelAlign, disabled, direction, colon } = useMemo(() => ({
        spacing: itemSpacing ?? formItemSpacing,
        labelWidth: itemLabelWidth ?? formLabelWidth,
        wrapperWidth: itemWrapperWidth ?? formWrapperWidth,
        labelGrow: itemLabelGrow ?? formLabelGrow,
        wrapperGrow: itemWrapperGrow ?? formWrapperGrow,
        labelAlign: itemLabelAlign ?? formLabelAlign,
        disabled: itemDisabled ?? formDisabled,
        direction: itemDirection ?? formDirection,
        colon: itemColon ?? formColon
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
    const [hide, setHide] = useState(hidden);
    const [forceUpdateFlag, setForceUpdateFlag] = useState(Date.now());
    const [error, setError] = useState();
    const uploadResultRef = useRef(null);
    const { contentBox, errorBox, uploadResultContainer, hideUploadResult } = useStyle({
        wrapperWidth
    });
    const displayName = useMemo(() => {
        if (name !== "" && !Array.isArray(children) && children instanceof Object) {
            return children.type.displayName;
        }
        return undefined;
    }, [children, name]);
    const onChange = useCallback((initValue) => {
        if (name !== "") {
            if (children instanceof Object && "props" in children) {
                children.props.onChange?.(initValue);
            }
            let value = (displayName?.includes("Upload") ?? false) && displayName !== "UploadDrag" ? uploadResultRef.current?.getFileInfos() : initValue;
            if (normalize !== undefined) {
                value = normalize(initValue);
            }
            setFormValue({ [name]: value });
        }
    }, [children, displayName, name, normalize, setFormValue]);
    const onUploadRemove = useCallback((id, isInit) => {
        if (isInit) {
            setFormValue({ [name]: getFormValue([name])[name].filter((item) => item.id !== id) });
        }
        if (children instanceof Object && "props" in children) {
            children.props.onRemoveFile?.(id, isInit);
        }
    }, [children, getFormValue, name, setFormValue]);
    const forceUpdate = useCallback(() => {
        setForceUpdateFlag(Date.now());
    }, []);
    const uploadResults = useCallback(() => {
        if (children instanceof Object) {
            switch (displayName) {
                case "UploadButton":
                case "UploadImage":
                    return (React.createElement("div", { className: clsx(uploadResultContainer, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                        React.createElement(UploadResults, { ...{ ...uploadResult, initialFile: getFormValue([name])[name] ?? defaultVal }, onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled })));
                case "UploadButtonLB":
                case "UploadImageLB":
                    return (React.createElement("div", { className: clsx(uploadResultContainer, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                        React.createElement(UploadResultLB, { ...uploadResult, initialFile: (getFormValue([name])[name] ?? defaultVal), onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled })));
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
    const childrenFormItem = useCallback(() => children instanceof Object && "props" in children
        && React.cloneElement(children, {
            ...children.props,
            defaultValue: getFormValue([name])[name] ?? defaultVal,
            initialFile: getFormValue([name])[name] ?? defaultVal,
            onRemoveFile: onUploadRemove,
            disabled,
            onChange,
            key: forceUpdateFlag
        }), [children, getFormValue, name, defaultVal, onUploadRemove, disabled, onChange, forceUpdateFlag]);
    const getVisibleStatus = useCallback(() => !hide, [hide]);
    const getLabel = useCallback(() => ({ label, displayName }), [displayName, label]);
    useEffect(() => {
        if (name !== "") {
            register(name, { setHide, forceUpdate, setError, getVisibleStatus, getLabel });
            if (rules !== undefined || required) {
                setRules(name, required ? ["notEmpty", ...rules ?? []] : rules ?? []);
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
    return (React.createElement(Stack, { direction: label !== undefined || required ? direction : "row", spacing: spacing, width: "100%" },
        label === undefined && !labelDispaly
            ? required && (React.createElement(StackItem, { grow: "0" },
                React.createElement(Label, { required: true, width: 10 })))
            : (React.createElement(Stack, { direction: "row", grow: labelGrow, basis: "unset", width: typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth, align: "start" },
                React.createElement(Label, { label: `${label ?? ""}`, colon: colon, required: required, width: "100%", align: labelAlign }))),
        name === "" || Array.isArray(children)
            ? children
            : (React.createElement(StackItem, { grow: wrapperGrow },
                React.createElement("div", { className: contentBox },
                    childrenFormItem(),
                    uploadResults(),
                    error !== undefined && error !== "" && React.createElement("div", { className: clsx(errorBox) }, error))))));
};
export default FormItem;
//# sourceMappingURL=index.js.map