import React, { useEffect, useState } from "react";
import './app.scss'
import { save, addRow, delateRow, changeValue } from '../../toolkit/app.js'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Input } from "antd";

// 输入：线段起点坐标，线段长度，线段绘制角度
// 输出：线段终点坐标
const getNextDot = (x, y, lineLength, angle) => {
    let a = angle, xLength, yLength, nX, nY, radian = Math.PI / 180
    if (angle > 0 && angle < 90) {
        xLength = lineLength * Math.sin(radian * (90 - a))
        yLength = lineLength * Math.sin(radian * a)
        nX = x + xLength; nY = y - yLength;
    } else if (angle > 90 && angle < 180) {
        a = 180 - a
        xLength = lineLength * Math.sin(radian * (90 - a))
        yLength = lineLength * Math.sin(radian * a)
        nX = x - xLength; nY = y - yLength;
    } else if (angle > 180 && angle < 270) {
        a = 270 - a
        yLength = lineLength * Math.sin(radian * (90 - a))
        xLength= lineLength * Math.sin(radian * a)
        nX = x - xLength; nY = y + yLength;
    } else if (angle > 270 && angle < 360) {
        a = 360 - a
        xLength = lineLength * Math.sin(radian * (90 - a))
        yLength = lineLength * Math.sin(radian * a)
        nX = x + xLength; nY = y + yLength;
    } else if (angle == 90) {
        nX = x; nY = y - lineLength;
    } else if (angle == 180) {
        nX = x - lineLength; nY = y;
    } else if (angle == 270) {
        nX = x; nY = y + lineLength;
    } else if (angle == 360 || angle == 0) {
        nX = x + lineLength; nY = y;
    }
    // console.log(x, y, lineLength, angle, xLength, yLength, parseInt(nX), -parseInt(nY))
    return { x: parseInt(nX), y: parseInt(nY) }
}
// 输出指定范围随机数
const rand = (min, max) => min + Math.round((max - min) * Math.random())

// 正则匹配数字
const getNumber = (str) => str.match(/\d+/g)

// 16进制转rgb
const set16ToRgb = (str) => {
    var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
    if(!reg.test(str)){return;}
    let newStr = (str.toLowerCase()).replace(/\#/g,'')
    let len = newStr.length;
    if(len == 3){
        let t = ''
        for(var i=0;i<len;i++){
            t += newStr.slice(i,i+1).concat(newStr.slice(i,i+1))
        }
        newStr = t
    }
    let arr = []; //将字符串分隔，两个两个的分隔
    for(var i =0;i<6;i=i+2){
        let s = newStr.slice(i,i+2)
        arr.push(parseInt("0x" + s))
    }
    return 'rgb(' + arr.join(",")  + ')';
 }

// 生成各层级的颜色
const getTreeColor = (tier, color) => {
    const colorArr = []
    const [color1, color2, color3 ] = getNumber(set16ToRgb(color))
    let step1 =  color1 / tier
    let step2 =  color2 / tier
    let step3 =  color3 / tier
    for(let i = 0; i < (tier + 1); i++) {
        let newColor1 = (color1 - step1 * i) || 0
        let newColor2 = (color2 - step2 * i) || 0
        let newColor3 = (color3 - step3 * i) || 0
        colorArr.push(`rgb(${newColor1}, ${newColor2}, ${newColor3})`)
    }
    return colorArr
}

const Canvas = () => {
    const [ctx, setCtx] = useState(null)
    const [treeData, setTreeData] = useState({
        originX: 0,// 原点坐标
        originY: 0,// 原点坐标
        lineLength: 80, // 树枝长度
        branchNumber: 2, // 分支个数
        branchTier: 6, // 分支层数
        color: '#1c6e31', // 树枝颜色
        lineWidth: 6, // 树枝粗细程度
    })

    const draw = (x, y, nextDotX, nextDotY, color, lineWidth) => {
        // debugger
        ctx.lineWidth = lineWidth;//设置线条宽度
        ctx.strokeStyle = color;//设置线条颜色
        ctx.beginPath(); // 开始绘制
        //先将笔尖移动到0,0处
        ctx.moveTo(x, y);
        //先将笔滑到下一点处
        ctx.lineTo(nextDotX, nextDotY);
        ctx.lineCap = 'round'; // 线条末端样式  butt：线段末端以方形结束 round：线段末端以圆形结束 square：线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
        //执行绘画的动作，如果没有执行stroke函数不会有任何的效果
        ctx.stroke();
        ctx.closePath(); // 结束绘制
    }
    // 原点坐标,树枝长度, 分支个数, 分支层数, 树枝颜色, 树枝粗细程度
    const run = (originX, originY, lineLength, branchNumber, branchTier, color, lineWidth) => {
        const colorArr = getTreeColor(branchTier, color)
        const dotArr = {
            nowX: originX,
            nowY: originY,
            nextX: null,
            nextY: null,
            color: colorArr.pop(),
            children: [],
            lineWidth,
        }
        const randAngle = rand(45, 135)
        const nextDot = getNextDot(originX, originY, lineLength, randAngle)
        dotArr.nextX = nextDot.x
        dotArr.nextY = nextDot.y
        
        const deepData = (origin1X, origin1Y, tier, color, lineWidth) => {
            const newArr = []
            if(tier == 0) return []
            for(let i = 0; i < branchNumber; i++) {
                let randAngle = 0
                if(tier > ((branchTier - 2) || 2) ) {
                    randAngle = rand(45, 135)
                } else {
                    randAngle = rand(0, 180)
                }
                const nextLineLength = (lineLength - (lineLength / branchTier / 1.5) * (branchTier - tier)) || 1
                // const nextLineLength = lineLength
                const nextDot = getNextDot(origin1X, origin1Y, nextLineLength , randAngle)
                const obj = {
                    randAngle,
                    nowX: origin1X,
                    nowY: origin1Y,
                    nextX: nextDot.x,
                    nextY: nextDot.y,
                    color: colorArr[tier - 2 ] || 'rgb(255, 0, 0)',
                    children: deepData(nextDot.x, nextDot.y, tier - 1, '', lineWidth - 1),
                    lineWidth: lineWidth,
                }
                newArr.push(obj)
            }
            return newArr
        }
        // 创建树节点
        dotArr.children = deepData(nextDot.x, nextDot.y, branchTier, '', lineWidth)
        console.log('dotArr', dotArr)
        // 绘制
        const deepDraw = (obj) => {
            if(obj.children.length == 0) return;
            obj.children.forEach(item => {
                setTimeout(()=>{
                    draw(item.nowX, item.nowY, item.nextX, item.nextY, item.color, item.lineWidth)
                    deepDraw(item)

                }, 100)
            });
        }
        draw(dotArr.nowX, dotArr.nowY, dotArr.nextX, dotArr.nextY, dotArr.color, lineWidth)
        deepDraw(dotArr)
    }
    // 清空
    const clearCanvas = () => {
        // console.log(ctx)
        ctx.clearRect(-300, -600, 600, 600);
        ctx.save()
    }

    // 开始绘制
    const startDraw = () => {
        clearCanvas()
        const { originX, originY, lineLength, branchNumber, branchTier, color, lineWidth } = treeData
        run(originX, originY, lineLength, branchNumber, branchTier, color, lineWidth)
        // console.log('ctx', ctx)
    }

    // 修改值
    const changeTreeValue = (value, key) => {
        const newData = JSON.parse(JSON.stringify(treeData))
        newData[key] = value
        setTreeData(newData)
    }

    useEffect(() => {
        const canvas = document.getElementById('canvas')
        var ctx = canvas.getContext('2d');
        ctx.translate(300, 600)// 原点坐标x, y
        setCtx(ctx)
    }, [])

    return <div className="canvasBox">
        <div style={{width: '100%'}}>
            <Button onClick={startDraw}>绘制 </Button>
            <Button onClick={clearCanvas}>清空 </Button>
        </div>
        <div className="treeInputBox">
            <div>原点坐标X:<Input value={treeData.originX} onChange={(e)=>changeTreeValue(e.target.value, 'originX')} type="text" className="treeInput" /></div>
            <div>原点坐标Y:<Input value={treeData.originY} onChange={(e)=>changeTreeValue(e.target.value, 'originY')} type="text" className="treeInput" /></div>
            <div>树枝长度:<Input value={treeData.lineLength} onChange={(e)=>changeTreeValue(e.target.value, 'lineLength')} type="text" className="treeInput" /></div>
            <div>分支个数:<Input value={treeData.branchNumber} onChange={(e)=>changeTreeValue(e.target.value, 'branchNumber')} type="text" className="treeInput" /></div>
            <div>分支层数:<Input value={treeData.branchTier} onChange={(e)=>changeTreeValue(e.target.value, 'branchTier')} type="text" className="treeInput" /></div>
            <div>树枝颜色:<input value={treeData.color} onChange={(e)=>changeTreeValue(e.target.value, 'color')} type="color" className="treeInput" /></div>
            <div>树枝粗细程度 :<Input value={treeData.lineWidth} onChange={(e)=>changeTreeValue(e.target.value, 'lineWidth')} type="text" className="treeInput" /></div>
        </div>
        <canvas className="canvas" id="canvas" width='600' height='600'></canvas>
    </div>
}

const App = () => {
    const { data, renderState } = useSelector(store => store.app)
    const dispatch = useDispatch()
    // 添加一行
    const add = () => {
        dispatch(addRow())
    }
    // 删除一行
    const deleteOneRow = (index) => {
        dispatch(delateRow({ index }))
    }
    // 修改值
    const changeInput = (value, index) => {
        dispatch(changeValue({ value, index }))
    }
    return <>
        <Button onClick={add}>添加</Button>
        {
            renderState.map((item, index) => {
                return <div key={index} className="box">
                    {item.text}
                    <Input className="input" onChange={(e) => changeInput(e.target.value, index)} value={item.value}></Input>
                    <span onClick={() => deleteOneRow(index)} className="span">-</span>
                </div>
            })
        }
        <Canvas></Canvas>
    </>
}

export default App; 