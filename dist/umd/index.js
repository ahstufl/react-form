var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
        define(["require", "exports", "./Form", "./FormItem", "./FormGroup", "./FormLine", "./FormList", "./context", "./interface"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LBFormFlagContext = exports.FormListIndexContext = exports.FormList = exports.FormLine = exports.FormGroup = exports.FormItem = void 0;
    const Form_1 = __importDefault(require("./Form"));
    const FormItem_1 = __importDefault(require("./FormItem"));
    exports.FormItem = FormItem_1.default;
    const FormGroup_1 = __importDefault(require("./FormGroup"));
    exports.FormGroup = FormGroup_1.default;
    const FormLine_1 = __importDefault(require("./FormLine"));
    exports.FormLine = FormLine_1.default;
    const FormList_1 = __importDefault(require("./FormList"));
    exports.FormList = FormList_1.default;
    const context_1 = require("./context");
    Object.defineProperty(exports, "FormListIndexContext", { enumerable: true, get: function () { return context_1.FormListIndexContext; } });
    Object.defineProperty(exports, "LBFormFlagContext", { enumerable: true, get: function () { return context_1.LBFormFlagContext; } });
    __exportStar(require("./interface"), exports);
    exports.default = Form_1.default;
});
//# sourceMappingURL=index.js.map