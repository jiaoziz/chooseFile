import React, { useState, useRef, useEffect } from "react";
import { Button, Tree, message, Input } from "antd";
import { FolderOutlined, FileOutlined } from '@ant-design/icons'
import RightMenu from "../rightMenu/rightMenu.jsx";
import hljs from 'highlight.js'
import 'highlight.js/styles/vs2015.css';
// import mammoth from 'mammoth'
import './chooseFile.css'

const { TextArea } = Input;
const worker = new Worker('worker.js')

const renderTreeData = (data) => {
    data.forEach(item => {
        if(item.type === 'file') {
            item.icon = <FileOutlined />
        } else {
            item.icon = <FolderOutlined />
            renderTreeData(item.children)
        }
    })
}

const ChooseFile = (props) => {
    // 存储用户选择的主文件夹
    const [firstDirectory, setFirstDirectory] = useState({})
    // 文件树
    const [treeData, setTreeData] = useState([])
    // 当前读取的文件内容
    const [textData, setTextData] = useState('')
    // 当前选中的文件信息 文件名 文件句柄
    const [checkFileDetail, setCheckFileDetail] = useState(null)
    // 全局提示
    const [messageApi, contextHolder] = message.useMessage();
    // 是否显示右键菜单
    const [showRightMenu, setShowRightMenu] = useState(false)
    // 右键菜单显示的位置及节点信息
    const [rightMenuDetails, setRightMenuDetails] = useState({
        x: 0,
        y: 0,
        nodeType: '',
        parentNodeDetail: {},
        isDirectory: false,
        selfNodeDetail: {}
    })

    const domRef = useRef(null)

    // worker
    worker.onmessage = (e) => {
        console.log('worker message', e.data)
        const { type, data } = e.data;
        // 创建文件树
        if (type === 'creatTree') {
            renderTreeData(data)
            console.log('data', data)
            setTreeData(data)
        }

        // 显示点击的文件内容
        if (type === 'clickNode') {
            // console.log('reader res', res.value)
            setTextData(JSON.parse(JSON.stringify(data.result)))
            delete data.result
            setCheckFileDetail(data)
        }

        // 保存修改
        if (type === 'saveText') {
            if (data.status) {
                messageApi.success({
                    content: data.message || '保存成功',
                    duration: 1.5
                })
            } else {
                messageApi.error({
                    content: data.message || '保存失败',
                    duration: 1.5
                })
            }
        }
        return ;
    }

    worker.addEventListener('error', (e) => {
        console.log('worker error', e)
    })

    // 点击选择文件夹
    const clickBtn = async () => {
        try {
            const res = await window.showDirectoryPicker({ mode: 'readwrite' })
            setFirstDirectory(res)
            worker.postMessage({ type: 'creatTree', data: res })
        } catch (error) {
            console.log('directoryPicker error', error);
        }
    }

    // 点击节点
    const clickNode = async (selectedKeys, { selected, selectedNodes, node, event }) => {
        console.log('selectedKeys', node.child);
        if (node.type === "file") {
            worker.postMessage({ type: 'clickNode', data: node.child })
        }
    }

    // 监听事件
    function eventListener(e) {
        if (e.target.className.toString().indexOf('menuBoxEvent') === -1) {
            // console.log('mousemove', e.target.className)
            setShowRightMenu(false)
            this.removeEventListener('mousemove', eventListener)
        }
    }

    // 右键节点
    const rightClickNodeFun = (e) => {
        console.log('rightClickNode e', e)
        // 当前鼠标右键点击的位置
        setRightMenuDetails({
            x: e.event.clientX,
            y: e.event.clientY,
            isDirectory: e.node.type === "directory",
            title: e.node.title,
            parentNodeDetail: e.node.parentNodeDetail,
            selfNodeDetail: e.node.selfNodeDetail
        })
        setShowRightMenu(true)

        // 移出rightMenu范围关闭
        setTimeout(() => {
            document.getElementById('box').addEventListener('mousemove', eventListener)
        }, 200)
    }

    // 保存文件
    const keyDown = (e) => {
        if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault()
            const html = domRef.current.textContent
            // const a= contextHolder
            worker.postMessage({
                type: 'saveText', data: {
                    fileSystemFileHandle: checkFileDetail.fileSystemFileHandle,
                    content: html
                }
            })
        }
    }

    // 编辑文件
    const changeText = (e) => {

        setTextData(e.target.value)
    }

    // 修改元素内容
    const inputPre = (e) => {
        const value = e.target.outerText
        setTextData(value)
    }

    // 获取光标位置
    const getSelectionAddres = () => {
        const selection = getSelection()

        console.log('text e', selection)
    }

    // 刷新文件树
    const reLoadTree = () => {
       const a = worker.postMessage({ type: 'creatTree', data: firstDirectory })
    }


    const [str, setStr] = useState('')

    useEffect(() => {
        const str1 = hljs.highlight(textData, { language: 'JSX', ignoreIllegals: true })
        document.getElementById('str').innerHTML = str1.value
    }, [textData])


    return <>
        {contextHolder}
        <Button id="btn" type="primary" onClick={clickBtn}>点击选择文件夹</Button>
        <div className="box" id="box">
            {
                showRightMenu && <RightMenu
                    messageApi={messageApi}
                    rightMenuDetails={rightMenuDetails}
                    reLoadTree={reLoadTree}
                    showRightMenu={(value) => setShowRightMenu(value)}
                >
                </RightMenu>}
            <Tree showIcon blockNode onSelect={clickNode} className="tree" treeData={treeData} onRightClick={rightClickNodeFun}>
            </Tree>
            <pre
                id="str"
                contentEditable
                ref={domRef}
                // onInput={inputPre}
                onKeyDown={keyDown}
                className="textMain pre"
                onClick={getSelectionAddres}
            ></pre>
        </div>
    </>
}

export default ChooseFile