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
        define(["require", "exports", "react", "../context"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const react_1 = __importStar(require("react"));
    const context_1 = require("../context");
    const FormList = (props) => {
        const { name, children } = props;
        const [elementList, setElementList] = (0, react_1.useState)([{ name: `${name}_formList_0` }]);
        const elementNameRef = (0, react_1.useRef)([]);
        const { formListRegister, formListUnRegister } = (0, react_1.useContext)(context_1.FormListContext);
        const addItem = (0, react_1.useCallback)((param) => {
            const { index } = Object.assign({ index: undefined }, param);
            if (index !== undefined) {
                setElementList((data) => {
                    if (index >= data.length) {
                        return [...data, { name: `${name}_formList_${data.length}`, param }];
                    }
                    return [...index === 0 ? [] : data.slice(0, index), { name: `${name}_formList_${data.length}`, param }, ...data.slice(index)];
                });
            }
            else {
                setElementList((data) => [...data, { name: `${name}_formList_${data.length}`, param }]);
            }
        }, [name]);
        const removeItem = (0, react_1.useCallback)((index) => {
            if (index === undefined) {
                setElementList((data) => (data.length > 0 ? data.slice(0, data.length - 1) : []));
            }
            else {
                setElementList((data) => (index >= 0 && index < data.length
                    ? [...index === 0 ? [] : data.slice(0, index), ...data.slice(index + 1)]
                    : data));
            }
        }, []);
        const getNames = (0, react_1.useCallback)(() => elementNameRef.current, []);
        const getIndex = (0, react_1.useCallback)((itemName) => elementNameRef.current.indexOf(itemName), []);
        (0, react_1.useEffect)(() => {
            elementNameRef.current = elementList.map((item) => item.name);
        }, [elementList]);
        (0, react_1.useEffect)(() => {
            if (name !== undefined) {
                formListRegister(name, { addItem, removeItem, getNames });
                return () => {
                    formListUnRegister(name);
                };
            }
            return undefined;
        }, [addItem, formListRegister, formListUnRegister, name, removeItem, getNames]);
        const contextValue = (0, react_1.useMemo)(() => ({ getIndex }), [getIndex]);
        if (Array.isArray(children)) {
            return null;
        }
        return (react_1.default.createElement(context_1.FormListIndexContext.Provider, { value: contextValue }, elementList.map(({ name: itemName, param }) => {
            var _a, _b;
            return react_1.default.cloneElement(children, Object.assign(Object.assign({}, children.props), { name: itemName, key: itemName, defaultValue: (_a = param === null || param === void 0 ? void 0 : param.value) !== null && _a !== void 0 ? _a : children.props.defaultValue, label: (_b = param === null || param === void 0 ? void 0 : param.label) !== null && _b !== void 0 ? _b : children.props.label }));
        })));
    };
    FormList.displayName = "FormList";
    exports.default = FormList;
});
//# sourceMappingURL=index.js.map