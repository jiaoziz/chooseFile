import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Radio, Form, Icon, Input, Col, Row, Select, Cascader, DatePicker } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { submitData, getCompanyData, getClientNameData } from '../../toolkit/jtkf.js'
import './jtkf.scss'

const FormItem = Form.Item
const { Option } = Select;

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];

const Jtkf = (props) => {
    const { 
        orderType, formInitialValues, classArr, company, appointmentTime, uniqueID, addDeviceArr 
    } = useSelector(state => state.jtkf)
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    // 修改订单类型
    const changeOrderType = (e) => {
        dispatch({
            type: 'jtkf/changeOrderType',
            payload: {
                orderType: e.target.value
            }
        })
    }
    // 提交表单
    const handleSubmit = (value) => {
        dispatch(submitData(value))
        dispatch({
            type: 'jtkf/save',
            payload: {
                formInitialValues: value
            }
        })
    }

    // 添加与删除设备
    const changeList = (type, index) => {
        dispatch({
            type: 'jtkf/changeDvList',
            payload: {
                type,
                index
            }
        })
    }
    // 修改input value
    const changeListValue =(e, firstLVIndex, secondLVIndex) => {
        dispatch({
            type: 'jtkf/changeListValue',
            payload: {
                value: e.target?.value || e,
                firstLVIndex, 
                secondLVIndex
            }
        })
    }

    const onchange =(name, e) => {
        const value = e.target?.value || e
        switch(name) {
            case 'companyName':
                dispatch(getClientNameData({Menu: 'addOrder', CustomerCompanyId: value}))
                break;
            case 'clientName':
                break;               
            case 'linkman':
                break;
            default: break;
        }
    }
    

    // 根据不同inputType渲染组件
    const renderItem = (name, type, placeholder, list, required, value='') => {
        let dom = <></>
        switch (type) {
            case 'input':
                dom = <>
                    <Input style={{width: '150px'}} value={value} onChange={(e)=>onchange(name, e)} placeholder={'请输入' + placeholder} ></Input>
                </>
                break;
            case 'select':
                dom = <>
                    <Select style={{width: '150px'}} value={value} onChange={(e)=>onchange(name, e)} placeholder={'请选择' + placeholder} >
                        {list.map((item, index) => {
                            return <Option value={item.value} key={index}>{item.label}</Option>
                        })}
                    </Select>
                </>
                break;
            case 'region':
                dom = <>
                    <Cascader onChange={(e)=>onchange(name, e)} options={options} placeholder={'请选择' + placeholder} />
                 </>
                break;

            case 'date':
                dom = <>
                    <DatePicker onChange={(e)=>onchange(name, e)} format="YYYY-MM-DD HH:mm:ss" />
                </>
                break;
            default: break;
        }

        return <div style={{padding: '10px', display: 'inline-block', width: '300px'}}>{required && <span style={{color: 'red'}}>* </span>}{placeholder} : {dom}</div>
    }

    // 渲染设备列表
    const renderDeviceArr = (name, type, placeholder, list, required, value='', firstLVIndex, secondLVIndex) => {
        let dom = <></>
        switch (type) {
            case 'input':
                dom = <>
                    <FormItem key={name+firstLVIndex+secondLVIndex} name={name} rules={[{ required: required, message: `缺少${placeholder}` }]}>
                        <Input placeholder={'请输入' + placeholder} value={value} onChange={(e)=>changeListValue(e, firstLVIndex, secondLVIndex)}></Input>
                    </FormItem>
                </>
                break;
            case 'select':
                dom = <>
                    <FormItem key={name+firstLVIndex+secondLVIndex} name={name} rules={[{ required: required, message: `缺少${placeholder}` }]}>
                        <Select style={{width: '150px'}} placeholder={'请选择' + placeholder} value={value} onChange={(e)=>changeListValue(e, firstLVIndex, secondLVIndex)}>
                            {list.map((item, index) => {
                                return <Option value={item.value} key={index}>{item.label}</Option>
                            })}
                        </Select>
                    </FormItem>
                </>
                break;
            default: break;
        }

        return dom
    }

    // 获取公司信息
    const getCompany = () => {
        dispatch(getCompanyData({Menu: 'addOrder'}))
    }

    useEffect(() => {
        dispatch({
            type: 'jtkf/copyAppointmentTime',
            payload: ''
        })
        getCompany()
    }, [])

    return <>
        {/* <Form form={form} onFinish={handleSubmit} initialValues={formInitialValues} className="form" layout="inline"> */}
            <div className="row noBottomBorder">
                <span>业务类型 : </span>
                {/* <FormItem name='orderType' label="业务类型" rules={[{ required: true, message: '' }]} > */}
                    <Radio.Group>
                        {orderType.map((item, index) => <Radio.Button value={index} onChange={changeOrderType} key={index}>{item}</Radio.Button>)}
                    </Radio.Group>
                {/* </FormItem> */}
            </div>
            <div className="row noTopBorder">
                {classArr.map((item, index) => {
                    // return <Form.Item name={item.name} label={item.label} key={index} rules={[{ required: true, message: '' }]}>
                       return <span style={{padding: '10px'}}>
                            {item.label} : 
                            <Radio.Group style={{marginLeft: '10px'}}>
                                {item.list.map((i, ind) => <Radio disabled={i.isDisabled} value={i.value} key={ind}>{i.label}</Radio>)}
                            </Radio.Group>
                        </span>
                    // </Form.Item>
                })}
            </div>
            <div className="row noTopBorder">
                {company.map((item, index) => {
                    // return <Form.Item name={item.name} label={item.label} key={index} rules={[{ required: item.required, message: `缺少${item.label}` }]}>
                      return <>{renderItem(item.name, item.inputType, item.label, item.list, item.required, item.value)}</>  
                    // </Form.Item>
                })}
            </div>
            <div className="row noTopBorder">
                {appointmentTime.map((item, index) => {
                    // return <Form.Item name={item.name} label={item.label} key={index} rules={[{ required: item.required, message: `缺少${item.label}` }]}>
                      return <>{renderItem(item.name, item.inputType, item.label, item.list, item.required, item.value)}</>  
                    // </Form.Item>
                })}
            </div>
            <div className="row noTopBorder">
                <div className="addText">添加设备 <div className="addBtn" onClick={()=>changeList('add')}>+</div> </div>
                {
                    addDeviceArr.map((ele, ind) => {
                        return <div className="listItem" key={ind}>
                            <div style={{width: '100%'}}>设备{ind+1}</div>
                            {
                                ele.map((item, index) => {
                                    return <div key={ind + "" + index}>
                                        {/* <Form.Item name={item.name} label={item.label} key={ind + index} rules={[{ required: item.required, message: `缺少${item.label}` }]}> */}
                                            {renderDeviceArr(item.name, item.inputType, item.label, item.list, item.required, item.value, ind, index)}
                                        {/* </Form.Item> */}
                                    </div> 
                                })
                            }
                            <div className="deleteBtn" onClick={()=>changeList('delete', ind)} style={{display: `${addDeviceArr.length>1?'inline-block':'none'}`}}>-</div>
                        </div>
                    })
                }
            </div>
            <div className="row noTopBorder">
                {/* <FormItem> */}
                    <Button htmlType="submit" type="primary">提交</Button>
                {/* </FormItem> */}
            </div>
        {/* </Form> */}
    </>
}

export default Jtkf;