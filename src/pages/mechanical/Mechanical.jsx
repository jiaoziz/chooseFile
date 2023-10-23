import React from "react";
import './Mechanical.scss'
import { Button, Input, Table } from "antd";

const Mechanical = () => {
    return <div className="mechanical">
        <div className="search">
            <div>
                <span>机械号: </span>
                <div className="input">
                    <Input />
                </div>
            </div>
            <div>
                <span>机械号: </span>
                <div className="input">
                    <Input />
                </div>
            </div>
            <div className="btns">
                <Button onClick={()=>{}} type="primary" >搜索</Button>
                <Button onClick={()=>{}}>重置</Button>
                <Button onClick={()=>{}} type="primary" >新增机械</Button>
                <Button onClick={()=>{}}>导出</Button>
            </div>
        </div>
        <div className="table">
            <Table></Table>
        </div>
    </div>
}

export default Mechanical;
