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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "@luban/ui-stack", "@luban/style", "@luban/ui-icon", "./style", "../context"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const react_1 = __importStar(require("react"));
    const ui_stack_1 = __importDefault(require("@luban/ui-stack"));
    const style_1 = require("@luban/style");
    const ui_icon_1 = require("@luban/ui-icon");
    const style_2 = __importDefault(require("./style"));
    const context_1 = require("../context");
    const ArrowsIcon = (0, ui_icon_1.getIcon)("向上");
    const FormGroup = (props) => {
        const { children, label, showFold = false, name } = props;
        const [fold, setFold] = (0, react_1.useState)(false);
        const { headContainer, inlineArrows, rotateArrows, contentBox, hideStyle } = (0, style_2.default)();
        const [hide, setHide] = (0, react_1.useState)(false);
        const { registerGroup, unRegisterGroup } = (0, react_1.useContext)(context_1.FormStoreContext);
        (0, react_1.useEffect)(() => {
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
        return (react_1.default.createElement(context_1.FormGroupContext.Provider, { value: props },
            react_1.default.createElement(ui_stack_1.default, { basis: "100%", itemBasis: "unset" },
                label !== undefined && label !== "" && (react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: (0, style_1.clsx)(headContainer) },
                        react_1.default.createElement("span", null, label),
                        showFold && (react_1.default.createElement("span", { className: (0, style_1.clsx)(inlineArrows, { [rotateArrows]: fold }), onClick: () => setFold(!fold) },
                            react_1.default.createElement(ArrowsIcon, null)))))),
                react_1.default.createElement("div", { className: (0, style_1.clsx)(contentBox, fold && hideStyle) },
                    react_1.default.createElement(ui_stack_1.default, { spacing: 24, direction: "row" }, children)))));
    };
    FormGroup.displayName = "FormGroup";
    exports.default = FormGroup;
});
//# sourceMappingURL=index.js.map