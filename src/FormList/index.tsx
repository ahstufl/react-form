import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import type {FC} from "react";
import {FormListContext, FormListIndexContext} from "../context";

export interface FormListPropsType {
    name: string;
}

const FormList: FC<FormListPropsType> = (props) => {
    const {name, children} = props;
    const [elementList, setElementList] = useState<{name: string; param?: {label?: string; value?: unknown}}[]>([{name: `${name}_formList_0`}]);
    const elementNameRef = useRef<string[]>([]);
    const {formListRegister, formListUnRegister} = useContext(FormListContext);
    const addItem = useCallback((param?: {label?: string; value?: unknown; index?: number;}) => {
        const {index} = {index: undefined, ...param};
        if (index !== undefined) {
            setElementList((data) => {
                if (index >= data.length) {
                    return [...data, {name: `${name}_formList_${data.length}`, param}];
                }
                return [...index === 0 ? [] : data.slice(0, index), {name: `${name}_formList_${data.length}`, param}, ...data.slice(index)];
            });
        } else {
            setElementList((data) => [...data, {name: `${name}_formList_${data.length}`, param}]);
        }
    }, [name]);

    const removeItem = useCallback((index?: number) => {
        if (index === undefined) {
            setElementList((data) => (data.length > 0 ? data.slice(0, data.length - 1) : []));
        } else {
            setElementList((data) => (index >= 0 && index < data.length
                ? [...index === 0 ? [] : data.slice(0, index), ...data.slice(index + 1)]
                : data));
        }
    }, []);

    const getNames = useCallback(() => elementNameRef.current, []);
    const getIndex = useCallback((itemName: string) => elementNameRef.current.indexOf(itemName), []);

    useEffect(() => {
        elementNameRef.current = elementList.map((item) => item.name);
    }, [elementList]);

    useEffect(() => {
        if (name !== undefined) {
            formListRegister(name, {addItem, removeItem, getNames});
            return () => {
                formListUnRegister(name);
            };
        }
        return undefined;
    }, [addItem, formListRegister, formListUnRegister, name, removeItem, getNames]);

    const contextValue = useMemo(() => ({getIndex}), [getIndex]);

    if (Array.isArray(children)) {
        return null;
    }

    return (
        <FormListIndexContext.Provider value={contextValue}>
            {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                elementList.map(({name: itemName, param}) => React.cloneElement(children as React.ReactElement, {
                    ...(children as React.ReactElement).props,
                    name: itemName,
                    key: itemName,
                    defaultValue: param?.value ?? ((children as React.ReactElement).props as {defaultValue?: unknown}).defaultValue,
                    label: param?.label ?? ((children as React.ReactElement).props as {label?: string}).label,
                }))
            }
        </FormListIndexContext.Provider>
    );
};

FormList.displayName = "FormList";
export default FormList;
