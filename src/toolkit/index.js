// 参考

import('@reduxjs/toolkit')
.then(({default: {
    createSlice,
    configureStore
}}) => {

    // 创建 状态切片
    const counterSlice = createSlice({
        name: 'counter',
        initialState: { value: 0},
        reducers: {
            increment(preState){
                return { value: preState.value + 1}
            },
            decrement(preState){
                // 原则上 state 是一个不可变数据
                // 不可以直接修改属性的值
                // 但是 @rudexjs/toolkit 内部引入了 immer 包
                // 会把修改属性值的方式 按照不可变方式修改state
                preState.value -= 1
            },
            updateByPayload(preState, action){
                preState.value = action.payload
            }
        }
    })

    // 创建仓库
    const store = configureStore({
        reducer: {
            counter: counterSlice.reducer
        }
    })


    // 添加状态监听值
    let unsubscribe = store.subscribe(() => {
        console.log('store 的状态发生了变化', store.getState())
    })

    // 修改状态 - 通过Slice对象生成action
    store.dispatch(counterSlice.actions.increment())
    store.dispatch(counterSlice.actions.decrement())
    store.dispatch(counterSlice.actions.updateByPayload(100))

    // 修改状态 - 手写 action
    store.dispatch({type: 'counter/increment', payload: void 0})

    // 取消监听
    unsubscribe()

    // 再次调用
    // 不会在触发订阅的回调
    store.dispatch(counterSlice.actions.increment())

    // 再次订阅
    store.subscribe(() => {
        console.log('这里是第二次订阅的： ', store.getState())
    })

    // 再次调用
    store.dispatch(counterSlice.actions.increment())
})




import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'

// First, create the thunk
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle' },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload)
    })
  },
})

// Later, dispatch the thunk as needed in the app
dispatch(fetchUserById(123))
