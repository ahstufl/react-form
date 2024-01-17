import React, { useContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import Stack from "@luban/ui-stack";
import Label from "@luban/ui-label";
import { UploadResults, UploadResultLB } from "@luban/ui-upload";
import { useDefaultSize } from "@luban/ui-utils";
import { clsx } from "@luban/style";
import { FormStoreContext, FormLayoutContext, FormGroupContext } from "../context";
import useStyle from "./style";
const defaultSizeMarginTop = {
    small: 6,
    middle: 10,
    large: 14
};
const FormItem = (props) => {
    const { name: realName = "", children, wrapperWidth: itemWrapperWidth, disabled: itemDisabled, labelPosition: itemLabelPosition, label, info, defaultValue: defaultVal, hidden = false, required = false, showUploadResults = true, uploadResult, rules, validateTrigger = "onChange", displayLabel: itemDisplayLabel } = props;
    const defaultSize = useDefaultSize();
    const { setFormValue, getFormValue, register, unRegister, setRules } = useContext(FormStoreContext);
    const { wrapperWidth: formWrapperWidth, disabled: formDisabled, displayLabel: formDisplayLabel, labelPosition: formLabelPosition, } = useContext(FormLayoutContext);
    const { name: groupName } = useContext(FormGroupContext);
    const name = useMemo(() => {
        if (groupName !== "") {
            if (realName === "") {
                return realName;
            }
            return `${groupName}.${realName}`;
        }
        return realName;
    }, [groupName, realName]);
    const { wrapperWidth, disabled, labelPosition, displayLabel } = useMemo(() => ({
        wrapperWidth: itemWrapperWidth ?? formWrapperWidth,
        disabled: itemDisabled ?? formDisabled,
        labelPosition: itemLabelPosition ?? formLabelPosition,
        displayLabel: itemDisplayLabel ?? formDisplayLabel,
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
    const [hide, setHide] = useState(hidden);
    const [forceUpdateFlag, setForceUpdateFlag] = useState(Date.now());
    const [error, setError] = useState();
    const uploadResultRef = useRef(null);
    const formItemRef = useRef(null);
    const defaultValueRef = useRef(defaultVal);
    const formObjRef = useRef({ hide, label });
    const { contentBox, errorBox, uploadResultContainer, hideUploadResult, rowLabelBox, labelBox, resultMaxHeightStyle } = useStyle({
        labelMarginTop: defaultSizeMarginTop[defaultSize],
        resultMaxHeight: uploadResult?.resultMaxHeight ?? 240
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
            setFormValue({ [name]: (displayName?.includes("Upload") ?? false) && displayName !== "UploadDrag" && displayName !== "UploadDragLB" ? uploadResultRef.current?.getFileInfos() : initValue });
        }
    }, [children, displayName, name, setFormValue]);
    const onUploadRemove = useCallback((id, isInit) => {
        if (isInit) {
            setFormValue({ [name]: getFormValue([name], true)[name].filter((item) => item.id !== id) });
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
                    return (React.createElement("div", { className: clsx(uploadResultContainer, resultMaxHeightStyle, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                        React.createElement(UploadResults, { ...{ ...uploadResult, initialFile: getFormValue([name], true)[name] ?? defaultVal }, onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled, id: name })));
                case "UploadButtonLB":
                case "UploadImageLB":
                    return (React.createElement("div", { className: clsx(uploadResultContainer, resultMaxHeightStyle, !showUploadResults && hideUploadResult), key: `${forceUpdateFlag}-result` },
                        React.createElement(UploadResultLB, { ...uploadResult, initialFile: (getFormValue([name], true)[name] ?? defaultVal), onRemoveFile: onUploadRemove, ref: uploadResultRef, disabled: disabled, id: name })));
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
    const childrenFormItem = useCallback(() => children instanceof Object && "props" in children
        && React.cloneElement(children, {
            ...children.props,
            defaultValue: getFormValue([name], true)[name] ?? defaultVal,
            initialFile: getFormValue([name], true)[name] ?? defaultVal,
            onRemoveFile: onUploadRemove,
            disabled,
            onChange,
            id: name,
            name,
            key: forceUpdateFlag,
            ref: formItemRef
        }), [children, getFormValue, name, defaultVal, onUploadRemove, disabled, onChange, forceUpdateFlag]);
    const getVisibleStatus = useCallback(() => !formObjRef.current.hide, []);
    const getLabel = useCallback(() => ({ label: formObjRef.current.label, displayName: formObjRef.current.displayName }), []);
    const getValue = useCallback(() => {
        if (uploadResultRef.current !== null) {
            return uploadResultRef.current.getFileInfos();
        }
        if (formItemRef.current !== null) {
            if ((formObjRef.current.displayName === "UploadDrag" || formObjRef.current.displayName === "UploadDragLB") && formItemRef.current.getFileInfos !== undefined) {
                return formItemRef.current.getFileInfos();
            }
            return formItemRef.current.getValue?.() ?? formItemRef.current.value;
        }
        return undefined;
    }, []);
    useEffect(() => {
        formObjRef.current = {
            ...formObjRef.current,
            label,
            hide,
            displayName
        };
    }, [displayName, hide, label]);
    useEffect(() => {
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
    useEffect(() => {
        if (name !== "" && (rules !== undefined || required)) {
            setRules(name, required ? ["notEmpty", ...rules ?? []] : rules ?? [], validateTrigger);
        }
    }, [name, required, rules, setRules, validateTrigger]);
    const hideLabel = useMemo(() => {
        if (label === undefined && !displayLabel) {
            return true;
        }
        return false;
    }, [displayLabel, label]);
    const showStar = useMemo(() => required || (Array.isArray(rules) && rules.find((item) => item instanceof Object && item.type === "required") !== undefined), [required, rules]);
    if (hide) {
        return null;
    }
    return (React.createElement(Stack, { direction: labelPosition, spacing: labelPosition === "row" && !hideLabel ? 16 : 8, grow: "unset", width: wrapperWidth, basis: "unset" },
        (labelPosition === "column" || !hideLabel || showStar) && (React.createElement(Stack, { direction: "row", basis: "unset", width: labelPosition === "row" && (label !== undefined || displayLabel) ? 88 : undefined, align: "start", grow: "unset" },
            React.createElement("div", { className: clsx(labelBox, labelPosition === "row" && rowLabelBox) },
                React.createElement(Label, { label: `${label ?? ""}`, required: showStar, width: "100%", align: labelPosition === "row" ? "right" : "left", info: info }),
                labelPosition === "column" && error !== undefined && error !== "" && React.createElement("div", { className: clsx(errorBox) }, error)))),
        name === "" || Array.isArray(children)
            ? children
            : (React.createElement(Stack, { align: "center", direction: "row" },
                React.createElement("div", { className: contentBox },
                    childrenFormItem(),
                    uploadResults(),
                    labelPosition === "row" && error !== undefined && error !== "" && React.createElement("div", { className: clsx(errorBox) }, error))))));
};
FormItem.displayName = "FormItem";
export default FormItem;
//# sourceMappingURL=index.js.map