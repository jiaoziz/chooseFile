import React, { useState, useRef,  useEffect } from "react";
import { Button, Tree, message, Input } from "antd";
// import hljs from 'highlight.js'
// import 'highlight.js/styles/vs2015.css';
// import mammoth from 'mammoth'
import './chooseFile.css'

const { TextArea } = Input;

const ChooseFile = (props) => {
    // 文件树
    const [treeData, setTreeData] = useState([])
    // 当前读取的文件内容
    const [textData, setTextData] = useState('')
    // 当前选中的文件信息 文件名 文件句柄
    const [checkFileDetail, setCheckFileDetail] = useState(null)
    // 全局提示
    const [messageApi, contextHolder] = message.useMessage();

    const domRef = useRef(null)
    const worker = new Worker('worker.js')

    // worker
    worker.addEventListener('message', (e) => {
        console.log('worker message', e.data)
        const { type, data } = e.data;
        // 创建文件树
        if(type === 'creatTree') {
            setTreeData(data)
        }

        // 显示点击的文件内容
        if(type === 'clickNode') {
                // console.log('reader res', res.value)
                setTextData(JSON.parse(JSON.stringify(data)))
                delete data.result
                setCheckFileDetail(data)
        }

        // 保存修改
        if(type === 'saveText') {
            if(data.status) {
                messageApi.success({
                    content: data.message,
                    duration: 1.5
                })
            } else {
                messageApi.error({
                    content: data.message,
                    duration: 1.5
                })
            }
        }
    })
    
    worker.addEventListener('error', (e) => {
        console.log('worker error', e)
    })

    // 点击选择文件夹
    const clickBtn = async () => {
        try {
            const res = await window.showDirectoryPicker({ mode: 'readwrite' })
            worker.postMessage({type: 'creatTree', data: res})
        } catch (error) {
            console.log('directoryPicker error', error);
        }
    }

    // 点击节点
    const clickNode =async (selectedKeys, {selected, selectedNodes, node, event}) => {
        console.log('selectedKeys',  node);
        if(node.type ==="file") {
            worker.postMessage({type: 'clickNode', data: node.child})
        }
    }

    // 保存文件
    const keyDown = (e) => {
        if(e.ctrlKey && e.keyCode == 83) {
            e.preventDefault()
            const html = domRef.current.textContent
            // const a= contextHolder
            worker.postMessage({type: 'saveText', data: {
                fileSystemFileHandle: checkFileDetail.fileSystemFileHandle,
                content: html
            }})
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
        
        console.log('text e', selection )
    }


    const [str, setStr] = useState('')

    useEffect(()=>{
    //    const str1 = hljs.highlight(textData, {language: 'JSX', ignoreIllegals: true})
    //    console.log('str', str1)
       document.getElementById('str').innerHTML = textData
    }, [textData])


    return <>
        {contextHolder}
        <Button id="btn" type="primary" onClick={clickBtn}>点击选择文件夹</Button>
        <div className="box">
            <Tree blockNode onSelect={clickNode} className="tree" treeData={treeData}></Tree>            
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