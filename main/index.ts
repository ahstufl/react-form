import React, {useRef, useCallback} from "react";
import type {ComponentStory} from "@storybook/react";
import {uncontrolled, UploadImage, UploadButton, UploadDrag, DatePicker as UIDatePicker, Radio as UIRadio, Select as UISelect, Input as UIInput, InputNumber as UIInputNumber, Switch as UISwitch, MultipleSelect as UIMultipleSelect, TextArea as UITextArea, Button} from "@luban/ui";
import type {FormRefType} from "@luban/ui";
import FormListItem from "./FormListItem";
import Form from "./Form";
import FormItem from "./FormItem";
import FormGroup from "./FormGroup";
import FormLine from "./FormLine";
import FormList from "./FormList";
import {FakeHandler, initialFile} from "../upload/fakeHandler";

const Input = uncontrolled(UIInput);
const InputNumber = uncontrolled(UIInputNumber);
const Switch = uncontrolled(UISwitch);
const TextArea = uncontrolled(UITextArea);
const MultipleSelect = uncontrolled(UIMultipleSelect);
const Select = uncontrolled(UISelect);
const DatePicker = uncontrolled(UIDatePicker);
const Radio = uncontrolled(UIRadio);

export default {
    title: "数据录入/Form 表单",
    component: Form,
};

const selectOptions = [
    {title: "明月几时有，把酒问青天。", value: "value1", backgroundColor: "#EBFAED", info: "水调歌头·明月几时有"},
    {title: "人有悲欢离合，月有阴晴圆缺，此事古难全。", value: "value2", backgroundColor: "#E6F2FE", info: "水调歌头·明月几时有"},
    {title: "十年生死两茫茫，不思量，自难忘。", value: "value3", disabled: true, info: "江城子·乙卯正月二十日夜记梦"},
    {title: "相顾无言，惟有泪千行。", backgroundColor: "#EBFAED"},
    {title: "怒发冲冠，凭栏处、潇潇雨歇。", backgroundColor: "#EBFAED"},
    {title: "大江东去，浪淘尽、千古风流人物。", info: "一个超长的描述信息，需要一些占位"},
    {title: "江山如画，一时多少豪杰。", value: "value6", info: "description"},
    {title: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。", value: "value7", info: "description"},
    {title: "满地黄花堆积，憔悴损，如今有谁堪摘？", backgroundColor: "#EBFAED"},
    {title: "梧桐更兼细雨，到黄昏、点点滴滴。"}
];

const Template: ComponentStory<typeof Form> = (args) => {
    const formRef = useRef<FormRefType>(null);
    /** 兼容storybook文档 Docs模式下有多个上传组件有相同id的情况 */
    const timeRef = useRef<string>(Date.now().toString());
    const submit = useCallback(() => {
        if (formRef.current !== null) {
            formRef.current.submit();
        }
    }, []);

    const resetForm = useCallback(() => {
        if (formRef.current !== null) {
            formRef.current.resetForm();
        }
    }, []);

    const add = useCallback(() => {
        if (formRef.current !== null) {
            formRef.current.formListAdd(`formList_uploadImage_${timeRef.current}`);
        }
    }, []);

    const remove = useCallback(() => {
        if (formRef.current !== null) {
            formRef.current.formListRemove(`formList_uploadImage_${timeRef.current}`);
        }
    }, []);

    const addStudy = useCallback(() => {
        if (formRef.current !== null) {
            formRef.current.formListAdd("listTest");
        }
    }, []);

    return (
        <>
            <h4>目前使用非受控ui组件（使用uncontrolled包裹）</h4>
            <h5>{"import {uncontrolled,, Input as UIInput} from \"@luban/ui\";"}</h5>
            <h5>const Input = uncontrolled(UIInput);</h5>
            <h5>示例代码可查看Form包readme文件，参数类型含义可查看接口文件内部注释，详细使用文档在完善</h5>
            <Form
                ref={formRef}
                {...args}
            >
                <FormItem name="input" label="姓名" required disabled info="111111">
                    <Input />
                </FormItem>
                <FormItem name="text" label="籍贯" rules={[{type: "required", message: "请填写您的籍贯"}]}>
                    <Input />
                </FormItem>
                <FormItem
                    name="inputNumber"
                    label="数字输入框"
                    defaultValue={200}
                    rules={[
                        {type: "number", max: 100, message: "不能大于100"},
                        {type: "number", min: 0, message: "不能小于0"},
                    ]}
                >
                    <InputNumber
                        placeholder="请输入年龄"
                    />
                </FormItem>
                <FormItem
                    name="multipleType"
                    label="审批方式"
                    required
                    info="或签：任一审批人提交，流程即流转到下一节点。会签：所有审批人提交，流程才流转到下一节点"
                >
                    <Radio options={[
                        {
                            title: "会签",
                            value: 1
                        },
                        {
                            title: "或签",
                            value: 2
                        }
                    ]}
                    />
                </FormItem>
                <FormItem name="switch" label="状态" required>
                    <Switch content={["已毕业", "在上学"]} />
                </FormItem>
                <FormItem name="time" label="毕业时间" required>
                    <DatePicker />
                </FormItem>
                <FormItem name="school" label="现在学习学校" required>
                    <Input />
                </FormItem>
                <FormList name="listTest">
                    <FormItem label="学习经历" required>
                        <FormListItem formRef={formRef} listName="listTest" />
                    </FormItem>
                </FormList>
                <FormItem>
                    <Button text="新增" onClick={addStudy} />
                </FormItem>
                <FormItem name="select1" label="你喜欢的宋词" required>
                    <Select
                        options={selectOptions}
                        placeholder="请选择你比较喜欢的宋词"
                        search
                        infoPosition="bottom"
                    />
                </FormItem>
                <FormItem name="select" label="你喜欢的宋词" required>
                    <MultipleSelect
                        options={selectOptions}
                        placeholder="请选择你比较喜欢的宋词"
                        search
                        infoPosition="bottom"
                    />
                </FormItem>
                <FormItem name="area" label="名人名言" required rules={[{type: "text", maxLength: 150, message: "最大输入150字"}]}>
                    <TextArea maxLength={150} />
                </FormItem>
                <FormGroup name="formGroup" label="表单测试" showFold>
                    <FormItem name="year" required label="年选择器">
                        <DatePicker mode="year" />
                    </FormItem>
                    <FormItem name="month" required label="月选择器">
                        <DatePicker mode="month" />
                    </FormItem>
                    <FormItem name="day" required label="日选择器">
                        <DatePicker />
                    </FormItem>
                </FormGroup>
                <FormLine />
                <FormItem
                    name={`uploadImage_${timeRef.current}`}
                    wrapperWidth="100%"
                    label="身份证"
                    required
                    defaultValue={initialFile.map((v) => ({...v, src: "https://img2.baidu.com/it/u=366174550,2416382650&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=650"}))}
                    uploadResult={{
                        image: true,
                        // eslint-disable-next-line no-console
                        onRemoveFile: (id, i) => console.log("remove id", id, i)
                    }}
                >
                    <UploadImage
                        multiple
                        fileTypes={["png", "jpeg"]}
                        Handler={FakeHandler}
                        config={{current: {}}}
                    />
                </FormItem>
                <FormList name={`formList_uploadImage_${timeRef.current}`}>
                    <FormItem
                        wrapperWidth="100%"
                        label="每日分享"
                        required
                        uploadResult={{
                            image: true,
                            // eslint-disable-next-line no-console
                            onRemoveFile: (id, i) => console.log("remove id", id, i)
                        }}
                    >
                        <UploadImage
                            multiple
                            fileTypes={["png", "jpeg"]}
                            Handler={FakeHandler}
                            config={{current: {}}}
                        />
                    </FormItem>
                </FormList>
                <FormItem>
                    <Button text="新增" onClick={add} />
                    <Button text="删除" onClick={remove} type="secondary" />
                </FormItem>
                <FormItem
                    name={`uploadButton_${timeRef.current}`}
                    wrapperWidth="100%"
                    label="附件"
                    required
                    defaultValue={initialFile}
                    uploadResult={{
                        resultMaxHeight: 240,
                        // eslint-disable-next-line no-console
                        onRemoveFile: (id, i) => console.log("remove id", id, i)
                    }}
                >
                    <UploadButton
                        multiple
                        fileTypes={["png", "jpeg"]}
                        Handler={FakeHandler}
                        config={{current: {}}}
                    />
                </FormItem>
                <FormItem name={`uploadDrag_${timeRef.current}`} wrapperWidth="100%" label="文档" required defaultValue={initialFile}>
                    <UploadDrag
                        multiple
                        fileTypes={["png", "jpeg"]}
                        Handler={FakeHandler}
                        config={{current: {}}}
                    />
                </FormItem>
                <FormItem>
                    <Button text="重置数据" type="secondary" onClick={resetForm} />
                    <Button text="获取数据" onClick={submit} />
                </FormItem>
            </Form>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    switchForm: [
        {
            name: "switch",
            visibleRule: (value) => {
                if (value !== false) {
                    return {
                        show: ["school", "formGroup.day"],
                        hide: ["time"],
                    };
                }
                return {show: ["time"], hide: ["school", "formGroup.day"]};
            }
        }
    ],
    defaultValue: {
        switch: true,
        input: "小鲁班",
        inputNumber: 90,
        switchInput: "222",
        area: "Warning: [JSS] <popup />'s styles function doesn't rely on the theme argument. We recommend declaring styles as an object instead",
        select: ["value1"],
        formGroup: {day: 1696348800000},
        listTest: ["111", "222", "333"]
    },
    // eslint-disable-next-line no-console
    onError: (val) => console.log(val),
    // eslint-disable-next-line no-console
    onFinish: (val) => console.log(val)
};

export const 行内布局 = Template.bind({});
行内布局.args = {
    wrapperWidth: 500
};