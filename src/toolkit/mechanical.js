import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCompanyList, getClientNameList } from '../js/api.js'
    
// // 获取公司列表api
// export const getCompanyData = createAsyncThunk(
//     'jtkf/getCompanyData',
//     async (value, { dispatch, getState }) => {
//         const response = await getCompanyList(value)
//         return response
//     }
// )


const mechanicalSlice = createSlice({
    name: 'mechanical',
    initialState: {},
    reducers: {
        save(state, { payload }) {
            Object.keys(payload).forEach(item => {
                state[item] = payload[item]
            })
        },
    },
    // 请求异步
    extraReducers: (b) => {
        // b.addCase(submitData.fulfilled, (state, { payload }) => {
        //     console.log('submitData fulfilled', state, payload)
        // })
        // b.addCase(submitData.rejected, (state, { payload }) => {
        //     console.log('submitData rejected', state, payload)
        // })

    }
})

export default mechanicalSlice;
export const { save } = mechanicalSlice.actions
