import React, { useRef, useState } from "react";
import ReactDOM from 'react-dom';
import './Mechanical.scss'

// 生成指定宽高的网格
const createGrid = (width, height) => {
    const grid = [];
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            row.push({
                x: j,
                y: i,
                // 是否是空
                isEmpty: true,
                backgroundColor: 'rgb(236, 232, 232)'
            })
        }
        grid.push(row);
    }
    return grid;
}

const gridMap = createGrid(7, 6);
console.log(gridMap);

// 为元素添加可拖拽功能
const addDrag = (element, setCurrentItem) => {
    // 拖拽结束事件
    const onDragEnd = (e) => {
        // console.log('onDragEnd', e, width, height);
    }
    // 拖拽开始事件
    const onDragStart = (e) => {
        setCurrentItem(element)
    }


    return (<div draggable onDragEnd={onDragEnd} onDragStart={onDragStart} >{element}</div>)
}

// 2*2的图形
const Two = (props) => {
    return addDrag(
        <div itemsize={{ width: 2, height: 2 }} style={{ width: '100px', height: '100px', backgroundColor: 'red' }}>2 * 2</div>
        , props.setCurrentItem)
}

// 3*2的图形
const Three = (props) => {
    return addDrag(
        <div itemsize={{ width: 3, height: 2 }} style={{ width: '150px', height: '100px', backgroundColor: 'blue' }}>3 * 2</div>
        , props.setCurrentItem)
}

// 重新渲染网格
const reRenderGrid = (grid, x, y, currentItem) => {
    // 获取当前选中的图形的宽高
    const { width, height } = currentItem.props.itemsize;
    // 获取当前选中的图形的背景色
    const { backgroundColor } = currentItem.props.style;
    // 递归渲染单个网格
    let newGrid = JSON.parse(JSON.stringify(grid));
    if (x + width - 1 > newGrid[0].length - 1 || y + height - 1 > newGrid.length - 1) { console.log('图形尺寸超出网格'); return grid; };
    if (!newGrid[y][x]?.isEmpty) { console.log('当前位置存在图形'); return grid; }
    for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
            if (!newGrid[j][i].isEmpty) { console.log('该位置存在图形:' + i + ',' + j); return grid; };
            newGrid[j][i].backgroundColor = backgroundColor;
            newGrid[j][i].isEmpty = false;
        }
    }
    return newGrid;
}

// 拖拽
const Mechanical = () => {
    // 5*5的网格
    const [grid, setGrid] = useState(gridMap);
    // 当前选中的图形
    const [currentItem, setCurrentItem] = useState(null);

    // 放置事件
    const onDrop = (e) => {
        const { x, y } = JSON.parse(e.target.getAttribute('itemoption'));
        console.log('onDrop', x, y, currentItem.props.itemsize);
        const newGrid = reRenderGrid([...grid], x, y, currentItem)
        setGrid(newGrid);
    }

    return (
        <div className="gridbox">
            {
                grid.map((row, i) => {
                    return (
                        <div key={i} className="item-box">
                            {
                                row.map((cell, j) => {
                                    return (
                                        <div style={{ backgroundColor: cell.backgroundColor }} itemoption={JSON.stringify({ x: cell.x, y: cell.y })} onDrop={onDrop} onDragOver={(e) => e.preventDefault()} key={j} className="item" draggable>
                                            {cell.x} {cell.y}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
            <Two setCurrentItem={setCurrentItem} />
            <Three setCurrentItem={setCurrentItem} />
        </div>
    );
}

export default Mechanical;
