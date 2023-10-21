import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
    name: 'list',
    initialState: {
        list: [],
        data: [
            { 
                title: 'title1', 
                id: '0', 
                listData: [
                    {title: 'list11', id: '01'},
                    {title: 'list12', id: '02'},
                    {title: 'list13', id: '03'},
                ] 
            },
            { 
                title: 'title2', 
                id: '1', 
                listData: [
                    {title: 'list21', id: '11'},
                    {title: 'list22', id: '12'},
                    {title: 'list23', id: '13'},
                ] 
            },
            { 
                title: 'title3', 
                id: '2', 
                listData: [
                    {title: 'list31', id: '21'},
                    {title: 'list32', id: '22'},
                    {title: 'list33', id: '23'},
                ] 
            }
        ],
        dataItem: {
            title: '',
            id: '',
            listData: []
        }
    },
    reducers: {
        addList: (state, action)=>{
           state.list = action.payload
        },
        changeDataItem: (state, action) =>{ 
            state.dataItem =action.payload
        },
        resetData: (state) => {
            state.list = []
            state.dataItem = {
                title: '',
                id: '',
                listData: []
            }
        }
    }
}) 

export default listSlice
export const { addList, changeDataItem, resetData } = listSlice.actions
