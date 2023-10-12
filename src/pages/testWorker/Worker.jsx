import React from "react";
import { Button } from "antd";
import fun from './newMyWorker.js'

const TestA = () => {
    const myWorker = fun()

    myWorker.addEventListener('message', (e) => {
        console.log('message A', e)
    })

    const clickBtn = () => {
        myWorker.postMessage({data: 'TestA'})
    }

    return <>
        <Button onClick={clickBtn}></Button>
    </>
}

const TestB = () => {
    const myWorker = fun()

    myWorker.addEventListener('message', (e) => {
        console.log('message B', e)
    })

    const clickBtn = () => {
        myWorker.postMessage({data: 'TestB'})
    }

    return <>
        <Button onClick={clickBtn}></Button>
    </>
}

const Worker = () => {



    return <>
        <TestA></TestA>
        <TestB></TestB>
    </>
}
export default Worker;