import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { getData } from '../toolkit/store'
import { useDispatch, useSelector } from 'react-redux';

import About from './about.jsx'
import ChooseFile from './chooseFile/chooseFile.jsx'
import Worker from './testWorker/Worker.jsx'
import Jtkf from './jtkf/Jtkf.jsx'
import App from './app/App.jsx'
import Mechanical from './mechanical/Mechanical.jsx'
// import ThreePage from './threejs/threePage.jsx'
// import ThreePageExercise from './threejs-exercise/threePageExercise.jsx'
import MineSweeping from './mineSweeping/mineSweeping.jsx'

import './layout.css'

const { Header, Content, Footer, Sider } = Layout;

localStorage.setItem('p', 'admin')


const menuItemsArr = [
    {
        icon: UserOutlined,
        permission: ['admin', 'user'],
        path: '/about1',
        label: '关于1',
        children: [
            {
                permission: ['admin'],
                icon: AppstoreOutlined,
                path: '/about',
                label: '关于2',
            }
        ]
    },
    {
        permission: ['user'],
        icon: BarChartOutlined,
        path: '/',
        label: '主页'
    },
    {
        permission: ['admin', 'user'],
        icon: CloudOutlined,
        path: '/app',
        label: 'App'
    },   
    {
        permission: ['admin', 'user'],
        icon: CloudOutlined,
        path: '/jtkf',
        label: '客服系统'
    },
    {
        permission: ['admin', 'user'],
        icon: CloudOutlined,
        path: '/mechanical',
        label: '机械列表'
    },
    {
        permission: ['admin', 'user'],
        icon: CloudOutlined,
        path: '/testWorker',
        label: 'testWorker'
    },
    // {
    //     permission: ['admin', 'user'],
    //     icon: CloudOutlined,
    //     path: '/three',
    //     label: 'threeJS'
    // },
    // {
    //     permission: ['admin', 'user'],
    //     icon: CloudOutlined,
    //     path: '/threePageExercise',
    //     label: 'three-运动的物体'
    // },
    {
        permission: ['admin', 'user'],
        icon: CloudOutlined,
        path: '/mineSweeping',
        label: '扫雷'
    },
    {
        permission: [],
        icon: ShopOutlined,
        path: '/about2',
        label: '关于3',
        children: [
            {
                icon: TeamOutlined,
                path: '/about3',
                label: '关于4',
            }
        ]
    },
]


const AppLayout = (props) => {
    const state = useSelector(s => s.menu.list)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    window.onhashchange = (e) => {
        console.log('hash change', e)
    };

    // console.log('state', state);

    const cilckMenuItem = ({ key }) => {
        navigate(`${key}`)
    }

    useEffect(() => {
        dispatch(getData(menuItemsArr))
        console.log('pathname', window)
    }, [])

    // 切换角色
    const changeRole = (type)=>{
        // localStorage.setItem('p', type)
        dispatch({ type: 'menu/add', payload: [] })
        dispatch(getData(menuItemsArr))
    }

    return (
        <Layout hasSider>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div style={{ height: '50px' }} >
                    <Button type='link' onClick={()=>changeRole('admin')}>admin</Button>
                    <Button type='link' onClick={()=>changeRole('user')}>user</Button>
                </div>
                {
                    state.length && <Menu onClick={cilckMenuItem} theme="dark" mode="inline" items={state} />
                }

            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: 200,
                }}
            >
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                        height: '100%'
                    }}
                >
                    {
                        state.length ?
                            <div className='contentClass'>
                                <div className='contentCard'>
                                    <Routes>
                                        <Route path="/about" element={<About />} />
                                        <Route path="/about1" element={<About1 />} />
                                        <Route path="/app" element={<App />} />
                                        <Route path="/chooseFile" element={<ChooseFile />} />
                                        <Route path="/testWorker" element={<Worker />} />
                                        <Route path="/jtkf" element={<Jtkf />} />
                                        <Route path="/mechanical" element={<Mechanical />} />
                                        <Route path="/" element={<Home />} />
                                        {/* <Route path="/three" element={<ThreePage />} /> */}
                                        <Route path="/mineSweeping" element={<MineSweeping />} />
                                        {/* <Route path="/threePageExercise" element={<ThreePageExercise />} /> */}
                                    </Routes>
                                </div>
                            </div>
                            : <Spin />
                    }
                    <div id='three'></div>
                </Content>
            </Layout>
        </Layout>
    )
};


const Home = () => {
    return <div>
        主页
    </div>
}

const About1 = () => {
    return <div>
        about1
    </div>
}

export default AppLayout;