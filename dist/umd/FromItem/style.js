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
    const useStyle = (0, style_1.createUseStyles)(({ color, font }) => ({
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
    exports.default = useStyle;
});
//# sourceMappingURL=style.js.map