import { createUseStyles } from "@luban/style";
const useStyle = createUseStyles(({ color, font }) => ({
    contentBox: {
        position: "relative",
        width: ({ wrapperWidth }) => wrapperWidth
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
        marginTop: 16,
        "& > div": {
            display: "flex",
            flexWrap: "wrap"
        }
    },
    hideUploadResult: {
        marginTop: 0,
        height: 0,
        visibility: "hidden"
    }
}), { name: "form-item" });
export default useStyle;
//# sourceMappingURL=style.js.map