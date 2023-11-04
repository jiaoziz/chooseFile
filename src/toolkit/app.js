import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
    name: 'app',
    initialState: {
        data: [
            { label: 'label - 1', value: null, text: '1' },
            { label: 'label - 2', value: null, text: '2' },
            { label: 'label - 3', value: null, text: '3' },
        ],
        renderState: []
    },
    reducers: {
        save(state, {payload}) {
            return {...state,...payload}
        },
        // 添加
        addRow(state, {payload}) {
            state.renderState.push({value: null, text: 'label' + state.renderState.length})
        },
        // 删除
        delateRow(state, { payload }) {
           state.renderState.splice(payload.index, 1)
        },
        // 修改值
        changeValue(state, {payload}) {
            const {value, index} = payload
            state.renderState[index].value = value
        }
    }
})
export const { save, addRow, delateRow, changeValue } = appSlice.actions
export default appSlice.reducer;