import { createUseStyles } from "@luban/style";
const useStyle = createUseStyles(({ color, font, fontWeight }) => ({
    headContainer: {
        color: color.neutral[100],
        marginBottom: 16,
        position: "relative",
        font: font.t2,
        fontWeight: fontWeight.bold,
        paddingLeft: 12,
        display: "flex",
        "&::before": {
            content: "''",
            position: "absolute",
            width: 4,
            height: 12,
            background: color.primary[60],
            left: "0",
            top: "50%",
            transform: "translateY(-50%)"
        }
    },
    inlineArrows: {
        marginLeft: 8,
        font: font.t3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform .2s linear",
        color: color.neutral[100],
        cursor: "pointer"
    },
    rotateArrows: {
        transform: "rotate(180deg)",
    },
    contentBox: {
        transition: "height .2s linear",
    },
    hideStyle: {
        height: 0,
        overflow: "hidden"
    }
}), { name: "FormGroup" });
export default useStyle;
//# sourceMappingURL=style.js.map