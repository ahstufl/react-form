import React, { memo } from "react";
import { createUseStyles } from "@luban/style";
const useStyle = createUseStyles(({ color }) => ({
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
}), { name: "FormLine" });
const FormLine = () => {
    const { container } = useStyle();
    return (React.createElement("div", { "data-lbui-comp": "formline", className: container },
        React.createElement("hr", null)));
};
FormLine.displayName = "FormLine";
export default memo(FormLine);
//# sourceMappingURL=index.js.map