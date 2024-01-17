import { createContext } from "react";
import { FormListStore } from "./formListStore";
import { FormStore } from "./formStore";
export const FormLayoutContext = createContext({
    wrapperWidth: "100%",
    labelPosition: "row",
    disabled: false,
    displayLabel: true
});
export const FormStoreContext = createContext(new FormStore().getForm());
export const FormGroupContext = createContext({ name: "" });
export const FormListContext = createContext(new FormListStore().getFormList());
export const FormListIndexContext = createContext({ getIndex: () => 0 });
export const LBFormFlagContext = createContext(false);
//# sourceMappingURL=context.js.map