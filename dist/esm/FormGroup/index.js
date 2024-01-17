import React, { useState, useEffect, useContext } from "react";
import Stack from "@luban/ui-stack";
import { clsx } from "@luban/style";
import { getIcon } from "@luban/ui-icon";
import useStyle from "./style";
import { FormGroupContext, FormStoreContext } from "../context";
const ArrowsIcon = getIcon("向上");
const FormGroup = (props) => {
    const { children, label, showFold = false, name } = props;
    const [fold, setFold] = useState(false);
    const { headContainer, inlineArrows, rotateArrows, contentBox, hideStyle } = useStyle();
    const [hide, setHide] = useState(false);
    const { registerGroup, unRegisterGroup } = useContext(FormStoreContext);
    useEffect(() => {
        if (name !== "") {
            registerGroup(name, { setHide });
            return () => {
                unRegisterGroup(name);
            };
        }
        return undefined;
    }, [
        name,
        registerGroup,
        unRegisterGroup,
    ]);
    if (hide) {
        return null;
    }
    return (React.createElement(FormGroupContext.Provider, { value: props },
        React.createElement(Stack, { basis: "100%", itemBasis: "unset" },
            label !== undefined && label !== "" && (React.createElement("div", null,
                React.createElement("div", { className: clsx(headContainer) },
                    React.createElement("span", null, label),
                    showFold && (React.createElement("span", { className: clsx(inlineArrows, { [rotateArrows]: fold }), onClick: () => setFold(!fold) },
                        React.createElement(ArrowsIcon, null)))))),
            React.createElement("div", { className: clsx(contentBox, fold && hideStyle) },
                React.createElement(Stack, { spacing: 24, direction: "row" }, children)))));
};
FormGroup.displayName = "FormGroup";
export default FormGroup;
//# sourceMappingURL=index.js.map