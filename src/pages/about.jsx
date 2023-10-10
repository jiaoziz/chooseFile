import React, { useEffect, memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { getData } from '../toolkit/store'
import { addList, list, changeDataItem, resetData } from '../toolkit/list.js'

const arr = [
    { label: 'text1', id: 0 },
    { label: 'text2', id: 1 },
    { label: 'text3', id: 2 },
    { label: 'text4', id: 3 },
]

const arr1 = [
    { label: 'span1', id: 10 },
    { label: 'span2', id: 11 },
    { label: 'span3', id: 12 },
    { label: 'span4', id: 13 },
]


const A = (props) => {
    const { data, id, setRef, index } = props
    const [text, setText] = useState('')
    const [isShow, setIsShow] = useState(false)

    console.log('id, index', id, index);

    const filterValue = () => {
        const arr = data.filter(item => item.id === Number(id))
        return arr[0] ? arr[0].label : null
    }

    const show = () => {
        setIsShow(!isShow)
    }

    const clickItem = (item) => {
        // debugger
        setRef(item.id)
    }

    useEffect(() => {
        if (id !== '' && id !== undefined) {
            setText(filterValue)
        }
        // return () => {
        //     console.log(`A组件卸载  ${id}`);
        // }
    }, [id])

    return <div>
        <span onClick={show}>A组件显示{text}</span>

        <br />
        {
            isShow
                ? <MemoList data={data} id={id} clickItem={clickItem} />
                : null
        }
    </div>
}

const MemoList = memo((props) => {
    return <ul>
        {
            props.data.map((item, index) => {
                return <li style={{ color: props.id === item.id ? 'blue' : '' }} key={index} onClick={() => props.clickItem(item)}>
                    {item.label}
                </li>
            })
        }
    </ul>
})


const About = () => {
    const dispatch = useDispatch()
    const value = useSelector(state => state.count.value)
    const { list, data, dataItem } = useSelector((state) => state.list)

    useEffect(() => {
        console.log("about123");
        return () => {
            console.log('卸载');
            dispatch(resetData())
        }
    }, [])

    const add = () => {
        dispatch({ type: 'count/add2', payload: 2 })
    }

    const setRef = (index, value) => {
        const newObj = [...list]
        newObj[index] = value
        dispatch(addList(newObj))
    }
    const addData = () => {
        dispatch(addList(['', ...list]))
    }

    const clickData = (item) => {
        dispatch(changeDataItem(item))
    }

    return <div>
        <Button onClick={add}>点击value + 2</Button>
        <div>关于{value}</div>
        <Button onClick={addData}>点击添加一条</Button>
        <br />
        {
            list.map((item, index) => {
                return <div key={item + '' + index} >
                    <A key={item + '' + index} data={arr} index={index} setRef={(value) => setRef(index, value)} id={item} />
                    {/* <A key={item +''+ index} data={arr1} index={index}  setRef={(value) => setRef(index, value)} id={item} /> */}
                </div>
            })
        }
        <div style={{ display: 'flex' }}>
            {
                data.map((item, index) => {
                    return <div key={item.id}>
                        <Button type="link" onClick={() => clickData(item)} >{item.title}</Button>
                    </div>
                })
            }
        </div>
        <div style={{ border: '1px #ccc solid' }}>
            {
                dataItem.id === ''
                    ? <>空</>
                    : <div>
                        <h3>{dataItem.title}</h3>
                        <ul>
                            {
                                dataItem.listData.map((item, index) => {
                                    return <div key={index}>
                                        <li>{item.title} - {item.id}</li>
                                    </div>
                                })
                            }
                        </ul>
                    </div>
            }
        </div>
    </div>
}



export default About
