(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@luban/style"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const style_1 = require("@luban/style");
    const useStyle = (0, style_1.createUseStyles)(({ color, font, fontWeight }) => ({
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
    exports.default = useStyle;
});
//# sourceMappingURL=style.js.map