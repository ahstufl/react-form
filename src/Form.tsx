import React, {forwardRef, useMemo, useImperativeHandle, useCallback, useEffect} from "react";
import Stack from "@luban/ui-stack";
import {SizeProvider} from "@luban/ui-utils";
import useForm from "./formStore";
import useFormList from "./formListStore";
import {FormStoreContext, LBFormFlagContext, FormLayoutContext, FormListContext} from "./context";
import FormItem from "./FormItem";
import type {FormRefType, FormPropsType, FormItemPropsType} from "./interface";

const Form = forwardRef<FormRefType, FormPropsType>((props, ref) => {
    const {
        wrapperWidth = "100%",
        size = "middle",
        disabled = false,
        labelPosition = "row",
        defaultValue,
        switchForm,
        children,
        displayLabel = true,
        onError,
        onFinish
    } = props;
    const formInstance = useForm(defaultValue);
    const formListInstance = useFormList();
    const formLayoutValue = useMemo(() => ({
        wrapperWidth, disabled, labelPosition, displayLabel
    }), [wrapperWidth, disabled, labelPosition, displayLabel]);
    const submit = useCallback((event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        event?.stopPropagation();
        const result = formInstance.submit();
        if (result === true) {
            onFinish?.(formInstance.getFormValue());
        } else {
            onError?.({value: formInstance.getFormValue(), errors: result});
        }
    }, [formInstance, onError, onFinish]);
    const reset = useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        formInstance.resetForm();
    }, [formInstance]);

    useImperativeHandle<FormRefType, FormRefType>(ref, () => ({
        setFormValue: (value: Record<string, unknown>) => formInstance.setFormValue(value, false, true),
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

    return (
        <LBFormFlagContext.Provider value>
            <form
                data-lbui-comp="form"
                onSubmit={submit}
                onReset={reset}
            >
                <SizeProvider size={size}>
                    <FormStoreContext.Provider value={formInstance}>
                        <FormListContext.Provider value={formListInstance}>
                            <FormLayoutContext.Provider value={formLayoutValue}>
                                <Stack spacing={20} direction="row" itemBasis="unset">
                                    {children}
                                </Stack>
                            </FormLayoutContext.Provider>
                        </FormListContext.Provider>
                    </FormStoreContext.Provider>
                </SizeProvider>
            </form>
        </LBFormFlagContext.Provider>
    );
});

Form.displayName = "Form";

export {
    FormRefType,
    FormPropsType,
    FormItemPropsType,
    FormItem
};

export default Form;
