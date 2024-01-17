import React, {useState, useEffect, useContext} from "react";
import type {FC} from "react";
import Stack from "@luban/ui-stack";
import {clsx} from "@luban/style";
import {getIcon} from "@luban/ui-icon";
import useStyle from "./style";
import {FormGroupContext, FormStoreContext} from "../context";
import type {FormGroupPropsType} from "../interface";

const ArrowsIcon = getIcon("向上");
const FormGroup: FC<FormGroupPropsType> = (props) => {
    const {children, label, showFold = false, name} = props;
    const [fold, setFold] = useState<boolean>(false);
    const {headContainer, inlineArrows, rotateArrows, contentBox, hideStyle} = useStyle();
    const [hide, setHide] = useState<boolean>(false);
    const {registerGroup, unRegisterGroup} = useContext(FormStoreContext);

    useEffect(() => {
        if (name !== "") {
            registerGroup(name, {setHide});
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

    return (
        <FormGroupContext.Provider value={props}>
            <Stack basis="100%" itemBasis="unset">
                {
                    label !== undefined && label !== "" && (
                        <div>
                            <div className={clsx(headContainer)}>
                                <span>{label}</span>
                                {showFold && (
                                    <span className={clsx(inlineArrows, {[rotateArrows]: fold})} onClick={() => setFold(!fold)}>
                                        <ArrowsIcon />
                                    </span>
                                )}
                            </div>

                        </div>
                    )
                }
                <div className={clsx(contentBox, fold && hideStyle)}>
                    <Stack spacing={24} direction="row">
                        {children}
                    </Stack>
                </div>
            </Stack>
        </FormGroupContext.Provider>
    );
};
FormGroup.displayName = "FormGroup";

export default FormGroup;
