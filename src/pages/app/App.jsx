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
    } else if (angle == 360) {
        nX = x + lineLength; nY = y;
    }
    // console.log(x, y, lineLength, angle, xLength, yLength, parseInt(nX), -parseInt(nY))
    return { x: parseInt(nX), y: parseInt(nY) }
}
// 输出指定范围随机数
const rand = (min, max) => min + Math.round((max - min) * Math.random())

// 正则匹配数字
const getNumber = (str) => str.match(/\d+/g)

// 生成各层级的颜色
const getTreeColor = (tier, color) => {
    const colorArr = []
    const [color1, color2, color3 ] = getNumber(color)
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

    const draw = (x, y, nextDotX, nextDotY, color) => {
        // debugger
        ctx.lineWidth = 3;//设置线条宽度
        ctx.strokeStyle = color;//设置线条颜色
        ctx.beginPath(); // 开始绘制
        //先将笔尖移动到0,0处
        ctx.moveTo(x, y);
        //先将笔滑到下一点处
        ctx.lineTo(nextDotX, nextDotY);
        ctx.closePath(); // 结束绘制
        //执行绘画的动作，如果没有执行stroke函数不会有任何的效果
        ctx.stroke();
    }
    // 原点坐标, 分支个数, 分支层数
    const run = (originX, originY, lineLength, branchNumber, branchTier, color) => {
        const colorArr = getTreeColor(branchTier, color)
        const dotArr = {
            nowX: originX,
            nowY: originY,
            nextX: null,
            nextY: null,
            color: colorArr.pop(),
            children: []
        }
        const randAngle = rand(45, 135)
        const nextDot = getNextDot(originX, originY, lineLength, randAngle)
        dotArr.nextX = nextDot.x
        dotArr.nextY = nextDot.y
        
        const deepData = (origin1X, origin1Y, tier, color) => {
            const newArr = []
            if(tier == 0) return []
            for(let i = 0; i < branchNumber; i++) {
                let randAngle = 0
                if(tier > 3) {
                    randAngle = rand(45, 135)
                } else {
                    randAngle = rand(0, 180)
                }
                const nextLineLength = (lineLength - (lineLength / branchTier / 10) * tier) || 1
                const nextDot = getNextDot(origin1X, origin1Y, nextLineLength , randAngle)
                const obj = {
                    randAngle,
                    nowX: origin1X,
                    nowY: origin1Y,
                    nextX: nextDot.x,
                    nextY: nextDot.y,
                    color: colorArr[tier - 2 ] || 'rgb(255, 0, 0)',
                    children: deepData(nextDot.x, nextDot.y, tier - 1)
                }
                newArr.push(obj)
            }
            return newArr
        }
        // 创建树节点
        dotArr.children = deepData(nextDot.x, nextDot.y, branchTier)
        console.log('dotArr', dotArr)
        // 绘制
        const deepDraw = (obj) => {
            if(obj.children.length == 0) return;
            obj.children.forEach(item => {
                setTimeout(()=>{
                    draw(item.nowX, item.nowY, item.nextX, item.nextY, item.color)
                    deepDraw(item)

                }, 200)
            });
        }
        draw(dotArr.nowX, dotArr.nowY, dotArr.nextX, dotArr.nextY, dotArr.color)
        deepDraw(dotArr)
    }
    // 清空
    const clearCanvas = () => {
        // console.log(ctx)
        ctx.clearRect(-300, -600, 600, 600);
        ctx.save()
    }

    useEffect(() => {
        const canvas = document.getElementById('canvas')
        var ctx = canvas.getContext('2d');
        ctx.translate(300, 600)// 原点坐标x, y
        setCtx(ctx)
    }, [])
    return <div className="canvasBox">
        <Button onClick={() => run(0, 0, 50, 2, 8, 'rgb(28, 110, 49)')}>绘制 </Button>
        <Button onClick={() => clearCanvas()}>清空 </Button>
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