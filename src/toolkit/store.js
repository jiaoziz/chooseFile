import React from 'react';
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import listSlice from './list.js'
import mechanicalSlice from './mechanical.js'
import appSlice from './app.js'

const getDataList = async (data) => {
    return new Promise((res) => {
        setTimeout(() => {
            res({ data, success: true })
        }, 1000)
    })

}


export const getData = createAsyncThunk(
    'menu/getDataStatus',
    async (data, { dispatch }) => {
        const res = await getDataList(data)
        const p = localStorage.getItem('p')
        const dataArr = []
        // 过滤菜单
        const deepItem = (item, type) => {
            let obj = []
            item.forEach((item) => {
                if (item.permission.includes(p)) {
                    if (type) {
                        obj.push({
                            key: item.path,
                            icon: React.createElement(item.icon),
                            label: item.label,
                            children: item.children ? deepItem(item.children, true) : null
                        })
                    } else {
                        dataArr.push({
                            key: item.path,
                            icon: React.createElement(item.icon),
                            label: item.label,
                            children: item.children ? deepItem(item.children, true) : null
                        })
                    }
                }
            })
            if (type) {
                return obj.length ? obj : null
            }
        }
        deepItem(res.data)
        dispatch({ type: 'menu/add', payload: dataArr })
    }
)


const counterSlice = createSlice({
    name: 'count',
    initialState: { value: 0, list: [] },
    reducers: {
        add2(oldState, action) {
            oldState.value += action.payload
        }
    },
    // extraReducers:(b) => {
    //     console.log('2');

    //     b.addCase(getData.fulfilled, (state, action) => {
    //         state.list = action.payload
    //     })
    // }
})

const menuSlice = createSlice({
    name: 'menu',
    initialState: { list: [] },
    reducers: {
        add(state, action) {
            state.list = action.payload
        }
    },
    // extraReducers:(b) => {
    //     b.addCase(getData.fulfilled, (state, action) => {
    //         console.log('action',action);
    //         state.list = action.payload

    //     })
    // }
})

export const store = configureStore({
    reducer: {
        count: counterSlice.reducer,
        menu: menuSlice.reducer,
        list: listSlice.reducer,
        mechanical: mechanicalSlice.reducer,
        app: appSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            // 禁用可序列化检查
            serializableCheck: false
        })
    }
});
