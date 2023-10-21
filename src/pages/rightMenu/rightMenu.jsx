import React, { useState, useRef } from "react";
import { Button, Form, Modal, message, Input } from "antd";
import './rightMenu.css'

const worker = new Worker('worker.js')

const RightMenu = (props) => {
    const { reLoadTree, showRightMenu, messageApi } = props
    const { x, y, title, selfNodeDetail, parentNodeDetail, isDirectory } = props.rightMenuDetails
    const menuItemList = [{
        text: '新增文件',
        key: 'createFile',
        // 是否显示该菜单
        isShow: isDirectory
    },{
        text: '新增文件夹',
        key: 'createDirectory',
        isShow: isDirectory
    }, {
        text: `删除该${isDirectory ? '文件夹' : '文件'}`,
        key: 'deleteFile',
        isShow: true
    }]

    // 显示Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuOpacity, setMenuOpacity] = useState(1)
    const [keyType, setkeyType] = useState('')

    // 存储不影响视图更新的信息
    const comData = useRef({
        params: { key: '', title, parentNodeDetail, isDirectory, selfNodeDetail, newTitle: '' },
    })

    worker.onmessage = (e) => {
        const { type, data } = e.data
        const { status, message } = data.clickMenuItemResult
        console.log('rightMenu type data', type, data)
        if(type !== 'clickMenuItem') return;
        switch(data.key) {
            case 'createFile':
                if(status) {
                    messageApi.success({
                        content: message,
                        duration: 1.5
                    })
                } else {
                    if(status === undefined) break;
                    messageApi.error({
                        content: message,
                        duration: 1.5
                    })
                }
                break;
            case 'createDirectory':
                if(status) {
                    messageApi.success({
                        content: message,
                        duration: 1.5
                    })
                } else {
                    if(status === undefined) break;
                    messageApi.error({
                        content: message,
                        duration: 1.5
                    })
                }
                break;
            case 'delete':
                if(status) {
                    messageApi.success({
                        content: message,
                        duration: 1.5
                    })
                } else {
                    if(status === undefined) break;
                    messageApi.error({
                        content: message,
                        duration: 1.5
                    })
                }
                break;
            default: break;
        }
        
        // 重新加载树结构
        reLoadTree()
    }

    // 显示Modal
    const showModal = () => {
        setIsModalOpen(true);
    };

    // 点击Modal确定按钮
    const handleOk = (data) => {
        console.log('data', data)
        worker.postMessage({type: 'clickMenuItem', data: {...comData.current.params, newTitle: data.fileName} })
        setIsModalOpen(false);
        showRightMenu(false)

    };
    // 点击Modal取消按钮    
    const handleCancel = () => {
        setIsModalOpen(false);
        showRightMenu(false)
    };

    // 点击菜单
    const clickMenuItem = (key) => {
        
        comData.current.params.key = key
        setkeyType(key)
        switch (key) {
            case 'createFile':
            case 'createDirectory':
                // showRightMenu(false)
                setMenuOpacity(0)
                showModal()
                break;
            case 'deleteFile':
                worker.postMessage({type: 'clickMenuItem', data: comData.current.params })
                break;
            default: break;
        }

    }

    // 获取点击的菜单中文
    const getMenuChinese = () => {
        const item = menuItemList.find(item => item.key == keyType)
        return item?.text
    }

    return <>
        <div className="menuBox menuBoxEvent" style={{ left: x + 'px', top: y + 'px', opacity: menuOpacity }}>
            {
                menuItemList.map((item, index) => {
                    return item.isShow ? <div key={index}>
                        <div className="menuItem menuBoxEvent" onClick={()=>clickMenuItem(item.key)}>{item.text}</div>
                    </div> : null
                })
            }
        </div>
        <Modal title={`${getMenuChinese()}`} open={isModalOpen} footer={false} onOk={false} onCancel={handleCancel}>
            <Form onFinish={handleOk}>
                <div className="formBox">
                    <Form.Item
                        label="文件名"
                        name="fileName"
                        rules={[
                            {
                                required: true,
                                message: '请输入名称',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <div className="formFooter">
                        <Button htmlType="submit" type="primary" className="finshBtn">确认</Button>
                        <Button onClick={handleCancel}>取消</Button>
                    </div>
                </div>
            </Form>
        </Modal>
    </>
}

export default RightMenu;
