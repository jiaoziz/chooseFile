import React, { useState, useEffect } from 'react'
import './mineSweeping.scss'

// 生成从min（包含）到max（包含）的随机整数
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; // 向下取整，所以包含最大值和最小值
}

// 生成4 * 4范围内指定个数的随机坐标
function getRandomCoordinates(num = 2) {
    if(num < 1) return ;
    const arr = [];
    for (let i = 0; i >= 0; i++) {
        const result = getRandomIntInclusive(0, num) + '-' + getRandomIntInclusive(0, num)
        !arr.includes(result) && arr.push(result)
        if (arr.length === num) {
            console.log('minearr', arr)
            return arr
        }
    }
}

// 创建一个类，用于记录某个坐标的信息（自身坐标、当前坐标是否异常、是否可显示）
class Coordinate {
    constructor(x, y, isMine) {
        this.x = x;
        this.y = y;
        this.isMine = isMine; // 当前坐标是否是地雷
        this.isShow = false; // 当前坐标是否显示遮罩
        this.mineNumber = 0; // 当前坐标周围地雷数量
    }
}

// 地雷周围坐标的计算
const mineCalculate = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
// 目标周围坐标的计算
const targetCalculate = [[-1, 0], [0, -1], [0, 1], [1, 0]]

// 生成一个二维数组，用于存储地图信息
const map = (width = 4, height = 4, mineNum = 2) => {
    const arr = [];
    const targetArr = getRandomCoordinates(mineNum);
    for (let i = 0; i < width; i++) {
        const row = [];
        for (let j = 0; j < height; j++) {
            row.push(new Coordinate(i, j, targetArr.includes(`${i}-${j}`)));
        }
        arr.push(row);
    }
    targetArr.forEach(item => {
        const [x, y] = [item.split('-')[0] * 1, item.split('-')[1] * 1]
        mineCalculate.forEach(i => {
            const [j, k] = i;
            if (x + j >= 0 && x + j < width && y + k >= 0 && y + k < height && !arr[x + j][y + k].isMine) {
                arr[x + j][y + k].mineNumber++;
            }
        })
    })
    return arr;
}
const mapResult = map(4, 12, 12)

const MineSweeping = () => {
    const [mapInfo, setMapInfo] = useState(mapResult || []);
    // 点击元素修改目标的属性
    function changeItem(item) {
        console.log(item)
        const newMapInfo = [...mapInfo];
        const { x, y } = item;
        item.isShow = true;
        newMapInfo[x][y] = item;
        setMapInfo(newMapInfo)
        if(item.isMine) {
            alert('你输了！')
            // setMapInfo(map(12, 12, 12))
        } else if(!item.isMine) {
            setTimeout(() => {
                for(let i = 0; i < targetCalculate.length; i++ ) {
                    const [j, k] = targetCalculate[i];
                    if (
                        x + j >= 0 
                        && x + j < mapResult[0].length 
                        && y + k >= 0 
                        && y + k < mapResult.length 
                        && !mapInfo[x + j][y + k].isMine 
                        && !mapInfo[x + j][y + k].isShow
                        && !mapInfo[x + j][y + k].mineNumber
                    ) {
                        changeItem(mapInfo[x + j][y + k])
                    }
                }
            }, 200)
        }
    }
    // 右键排雷
    const rightClick = (e, item) => {
        e.preventDefault();
        const { x, y } = item;
        item.isShow = true;
        mapInfo[x][y] = item;
        setMapInfo([...mapInfo]);
    }
    return (
        <div className='Box'>
            {
                mapInfo.map((row, i) => {
                    return <div style={{ display: 'flex' }} key={i}>
                        {
                            row.map((item, j) => {
                                return (
                                    <div key={`${i}-${j}`}>
                                        <div onAuxClick={(e)=>rightClick(e, item)} onClick={()=>changeItem(item)} className='mineSweeping' style={{ background: !item.show ? '#ccc' : (item.isMine ? 'red' : 'white')}}>
                                            {!item.isShow ? '' : (item.isMine ? '💣' : item.mineNumber)}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div> 
                })
            }
            <button onClick={()=>setMapInfo(map(12, 12, 12))}>重置</button>
        </div>
    )
}

export default MineSweeping;