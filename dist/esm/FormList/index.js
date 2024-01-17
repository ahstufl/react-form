import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormListContext, FormListIndexContext } from "../context";
const FormList = (props) => {
    const { name, children } = props;
    const [elementList, setElementList] = useState([{ name: `${name}_formList_0` }]);
    const elementNameRef = useRef([]);
    const { formListRegister, formListUnRegister } = useContext(FormListContext);
    const addItem = useCallback((param) => {
        const { index } = { index: undefined, ...param };
        if (index !== undefined) {
            setElementList((data) => {
                if (index >= data.length) {
                    return [...data, { name: `${name}_formList_${data.length}`, param }];
                }
                return [...index === 0 ? [] : data.slice(0, index), { name: `${name}_formList_${data.length}`, param }, ...data.slice(index)];
            });
        }
        else {
            setElementList((data) => [...data, { name: `${name}_formList_${data.length}`, param }]);
        }
    }, [name]);
    const removeItem = useCallback((index) => {
        if (index === undefined) {
            setElementList((data) => (data.length > 0 ? data.slice(0, data.length - 1) : []));
        }
        else {
            setElementList((data) => (index >= 0 && index < data.length
                ? [...index === 0 ? [] : data.slice(0, index), ...data.slice(index + 1)]
                : data));
        }
    }, []);
    const getNames = useCallback(() => elementNameRef.current, []);
    const getIndex = useCallback((itemName) => elementNameRef.current.indexOf(itemName), []);
    useEffect(() => {
        elementNameRef.current = elementList.map((item) => item.name);
    }, [elementList]);
    useEffect(() => {
        if (name !== undefined) {
            formListRegister(name, { addItem, removeItem, getNames });
            return () => {
                formListUnRegister(name);
            };
        }
        return undefined;
    }, [addItem, formListRegister, formListUnRegister, name, removeItem, getNames]);
    const contextValue = useMemo(() => ({ getIndex }), [getIndex]);
    if (Array.isArray(children)) {
        return null;
    }
    return (React.createElement(FormListIndexContext.Provider, { value: contextValue }, elementList.map(({ name: itemName, param }) => React.cloneElement(children, {
        ...children.props,
        name: itemName,
        key: itemName,
        defaultValue: param?.value ?? children.props.defaultValue,
        label: param?.label ?? children.props.label,
    }))));
};
FormList.displayName = "FormList";
export default FormList;
//# sourceMappingURL=index.js.map