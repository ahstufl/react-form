import React, {useImperativeHandle, useCallback, useContext, forwardRef, useRef} from "react";
import {Input as UIInput, uncontrolled, Button, FormRefType, FormListIndexContext, InputRefType} from "@luban/ui";
import {createUseStyles} from "@luban/style";

const useStyle = createUseStyles(() => ({
    container: {
        display: "flex"
    }
}), {name: "FormListItem"});

const Input = uncontrolled(UIInput);
interface FormListItemType {
    defaultValue?: string;
    formRef: React.RefObject<FormRefType>;
    listName: string;
    name?: string;
    onChange?: (data: string) => void
}
interface FormListItemRef {
    value?: string;
    getValue?: () => string;
}
const FormListItem = forwardRef<FormListItemRef, FormListItemType>(({defaultValue, formRef, listName, name, onChange}, ref) => {
    const {getIndex} = useContext(FormListIndexContext);
    const inputRef = useRef<InputRefType>(null);
    const {container} = useStyle();
    const del = useCallback(() => {
        if (formRef.current !== null && name !== undefined) {
            formRef.current.formListRemove(listName, getIndex(name));
        }
    }, [formRef, getIndex, listName, name]);

    useImperativeHandle<FormListItemRef, FormListItemRef>(ref, () => ({
        getValue: () => inputRef.current?.value ?? ""
    }), []);

    return (
        <div className={container}>
            <Input defaultValue={defaultValue} onChange={onChange} ref={inputRef} />
            <Button text="删除" type="ghost" onClick={del} />
        </div>
    );
});


export default FormListItem;