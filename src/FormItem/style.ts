import {createUseStyles, opacityColor} from "@luban/style";
import type {FormItemStyle} from "../interface";

const useStyle = createUseStyles(({color, font}) => ({
    contentBox: {
        position: "relative"
    },
    errorBox: {
        color: color.alert[60],
        font: font.t1,
        position: "absolute",
        left: 0,
        bottom: -18,
        width: "100%",
        textOverflow: "ellipsis",
        overflow: "hidden",
        wordBreak: "break-all"
    },
    uploadResultContainer: {
        marginTop: 8,
        "& > div": {
            display: "flex",
            flexWrap: "wrap"
        }
    },
    hideUploadResult: {
        marginTop: 0,
        height: 0,
        visibility: "hidden"
    },
    rowLabelBox: {
        marginTop: ({labelMarginTop}: FormItemStyle) => labelMarginTop,
        marginBottom: ({labelMarginTop}: FormItemStyle) => labelMarginTop
    },
    labelBox: {
        position: "relative",
        minHeight: 20,
        "& $errorBox": {
            right: 0,
            top: 2,
            width: "unset",
            left: "unset",
            bottom: "unset"
        }
    },
    resultMaxHeightStyle: {
        maxHeight: ({resultMaxHeight}: FormItemStyle) => resultMaxHeight,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            width: "4px",
        },
        "&::-webkit-scrollbar-track": {
            background: opacityColor(color.neutral[0], 0),
        },
        "&::-webkit-scrollbar-thumb": {
            background: opacityColor(color.neutral[0], 0),
            borderRadius: "2px",
        },
        "&:hover": {
            "&::-webkit-scrollbar-thumb": {
                background: color.neutral[30],
            }
        }
    }
}), {name: "form-item"});

export default useStyle;
