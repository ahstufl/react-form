import React, {memo} from "react";
import type {FC} from "react";
import {createUseStyles} from "@luban/style";

const useStyle = createUseStyles(({color}) => ({
    container: {
        height: 1,
        width: "100%",
        "& hr": {
            height: 1,
            border: "none",
            backgroundColor: color.neutral[20],
            margin: 0
        }
    }
}), {name: "FormLine"});

const FormLine: FC = () => {
    const {container} = useStyle();
    return (
        <div data-lbui-comp="formline" className={container}>
            <hr />
        </div>
    );
};
FormLine.displayName = "FormLine";

export default memo(FormLine);
