import React, { forwardRef, useMemo, useImperativeHandle, useCallback, useEffect } from "react";
import Stack from "@luban/ui-stack";
import { SizeProvider } from "@luban/ui-utils";
import useForm from "./formStore";
import useFormList from "./formListStore";
import { FormStoreContext, LBFormFlagContext, FormLayoutContext, FormListContext } from "./context";
import FormItem from "./FormItem";
const Form = forwardRef((props, ref) => {
    const { wrapperWidth = "100%", size = "middle", disabled = false, labelPosition = "row", defaultValue, switchForm, children, displayLabel = true, onError, onFinish } = props;
    const formInstance = useForm(defaultValue);
    const formListInstance = useFormList();
    const formLayoutValue = useMemo(() => ({
        wrapperWidth, disabled, labelPosition, displayLabel
    }), [wrapperWidth, disabled, labelPosition, displayLabel]);
    const submit = useCallback((event) => {
        event?.preventDefault();
        event?.stopPropagation();
        const result = formInstance.submit();
        if (result === true) {
            onFinish?.(formInstance.getFormValue());
        }
        else {
            onError?.({ value: formInstance.getFormValue(), errors: result });
        }
    }, [formInstance, onError, onFinish]);
    const reset = useCallback((event) => {
        event.preventDefault();
        formInstance.resetForm();
    }, [formInstance]);
    useImperativeHandle(ref, () => ({
        setFormValue: (value) => formInstance.setFormValue(value, false, true),
        validate: formInstance.validate,
        resetForm: formInstance.resetForm,
        getFormValue: formInstance.getFormValue,
        submit,
        formListAdd: formListInstance.formListAdd,
        formListRemove: formListInstance.formListRemove
    }));
    useEffect(() => {
        formInstance.setSwitchStore(switchForm);
    }, [formInstance, switchForm]);
    useEffect(() => {
        formInstance.getListCallbackFunc(formListInstance.getFormListNames, formListInstance.formListAdd);
    }, [formInstance, formListInstance]);
    return (React.createElement(LBFormFlagContext.Provider, { value: true },
        React.createElement("form", { "data-lbui-comp": "form", onSubmit: submit, onReset: reset },
            React.createElement(SizeProvider, { size: size },
                React.createElement(FormStoreContext.Provider, { value: formInstance },
                    React.createElement(FormListContext.Provider, { value: formListInstance },
                        React.createElement(FormLayoutContext.Provider, { value: formLayoutValue },
                            React.createElement(Stack, { spacing: 20, direction: "row", itemBasis: "unset" }, children))))))));
});
Form.displayName = "Form";
export { FormItem };
export default Form;
//# sourceMappingURL=Form.js.map