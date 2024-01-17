var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "@luban/style"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const react_1 = __importStar(require("react"));
    const style_1 = require("@luban/style");
    const useStyle = (0, style_1.createUseStyles)(({ color }) => ({
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
        return (react_1.default.createElement("div", { "data-lbui-comp": "formline", className: container },
            react_1.default.createElement("hr", null)));
    };
    FormLine.displayName = "FormLine";
    exports.default = (0, react_1.memo)(FormLine);
});
//# sourceMappingURL=index.js.map