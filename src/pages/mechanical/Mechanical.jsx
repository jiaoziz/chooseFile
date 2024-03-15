import React, { useRef, useState } from "react";
import './Mechanical.scss'
import {map} from './map.js'
import { Button, Select, Form } from "antd";
import ExcelViewer from './NewExcelViewer.jsx'

const Mechanical = () => {
    const [form] = Form.useForm();
    const data = useRef({})
    const [selectOptions, setSelectOptions] = useState({
        type: map.type,
        typeChild: []
    })
    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // 	字段更新时触发回调事件
    const onValuesChange = (changedValues, allValues) => {
        console.log(changedValues, allValues);
    }
    return (
        <div className="formBox">
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onValuesChange={onValuesChange}
            initialValues={{}}
        >
            <Form.Item
                label="类型"
                name="type"
            >
                <Select options={selectOptions.type} />
            </Form.Item>
            <Form.Item
                label="类型子级"
                name="typeChild"
            >
                <Select options={selectOptions.typeChild} />
            </Form.Item>
            <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                    确认
                </Button>
            </Form.Item>
        </Form>
        <ExcelViewer></ExcelViewer>
        </div>
    );
}

export default Mechanical;
