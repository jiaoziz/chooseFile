import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCompanyList, getClientNameList } from '../js/api.js'

// 模拟异步
const postData =(data) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve({data, success: true, status: true})
        }, 1000)
    })
}

// 提交表单
export const submitData = createAsyncThunk(
    'jtkf/submitData',
    async (value, { dispatch, getState }) => {
        const response = await postData(value)
        return response
    }
)
    
// 获取公司列表api
export const getCompanyData = createAsyncThunk(
    'jtkf/getCompanyData',
    async (value, { dispatch, getState }) => {
        const response = await getCompanyList(value)
        return response
    }
)

// 获取客户名称api
export const getClientNameData = createAsyncThunk(
    'jtkf/getClientNameList',
    async (value, { dispatch, getState }) => {
        dispatch({
            type: 'jtkf/changeList',
            payload: {name: 'companyName'}
        })
        const response = await getClientNameList(value)
        return response
    }
)

const jtkfSlice = createSlice({
    name: 'jtkf',
    initialState: {
        orderType: ['新装', '检修', '加装', '拆装'],
        currentType: 0,
        // 类别、安装对象、付款类型、服务方式
        classArr: [
            {
                list: [
                    {value: 0, label: '正常', isDisabled: false},
                    {value: 1, label: '租赁', isDisabled: true},
                    {value: 2, label: '押金', isDisabled: true},
                    {value: 3, label: '试用', isDisabled: true},
                ],
                label: '类别',
                name: 'class'
            },
            {
                list: [
                    {value: 0, label: '车辆', isDisabled: false},
                    {value: 1, label: '智慧杆', isDisabled: false},
                ],
                label: '安装对象',
                name: 'InstallationObject'
            },
            {
                list: [
                    {value: 0, label: '不定期付款', isDisabled: true},
                    {value: 1, label: '先款后货', isDisabled: true},
                ],
                label: '付款类型',
                name: 'payType'
            },
            {
                list: [
                    {value: 0, label: '正常', isDisabled: false},
                    {value: 1, label: '保险', isDisabled: false},
                ],
                label: '服务方式',
                name: 'serviceMode'
            },
        ],
        // 公司名称、客户名称、客户地区、客户类型、联系人、联系电话、联系人职位、联系人角色
        company: [
            {
                label: '公司名称',
                name: 'companyName',
                required: false,
                inputType: 'select',
                value: null,
                list: []
            },
            {
                label: '客户名称',
                name: 'clientName',
                required: false,
                inputType: 'select',
                value: null,
                list: []
            },
            {
                label: '客户地区',
                name: 'clientRegion',
                required: false,
                inputType: 'region'
            },
            {
                label: '客户类型',
                name: 'clientType',
                required: false,
                inputType: 'select',
                list: [{value: 0, label: 'label 0'}],
                value: null
            },
            {
                label: '联系人',
                name: 'linkman',
                required: false,
                inputType: 'input'
            },
            {
                label: '联系电话',
                name: 'phone',
                required: false,
                inputType: 'input'
            },
            {
                label: '联系人职位',
                name: 'linkmanPosition',
                required: false,
                inputType: 'input'
            },
            {
                label: '联系人角色',
                name: 'linkmanRole',
                required: false,
                inputType: 'select',
                list: [{value: 0, label: 'label 0'}],
                value: null
            },
        ],
        // 预约时间、订单总额、渠道(中介)、订单佣金、含税类型、开票名称
        appointmentTime:[
            {
                label: '预约时间',
                name: 'appointmentTime',
                required: false,
                inputType: 'date'
            },
            {
                label: '订单总额',
                name: 'totalOrderAmount',
                required: false,
                inputType: 'input'
            },
            {
                label: '渠道(中介)',
                name: 'channel',
                required: false,
                inputType: 'select',
                list: [{value: 0, label: 'label 0'}],
                value: null
            },
            {
                label: '订单佣金',
                name: 'commission',
                required: false,
                inputType: 'input'
            },
            {
                label: '含税类型',
                name: 'taxInclusiveType',
                required: false,
                inputType: 'select',
                list: [{value: 0, label: 'label 0'}],
                value: null
            },
            {
                label: '开票名称',
                name: 'paymentName',
                required: false,
                inputType: 'input'
            },
            {
                label: '车牌号/车架号',
                name: 'installNumber',
                required: false,
                inputType: 'input'
            },
        ],
        appointmentTimeCopy: [],
        // 新装时需要添加的安装台数选择项
        newInstall: [ 
            {
                label: '安装台数',
                name: 'installNumber',
                required: false,
                inputType: 'input'
            },
        ],
        // 加装时需要添加的订单合同
        orderContract: [
            {
                label: '订单合同',
                name: 'installNumber',
                required: false,
                inputType: 'input'
            },

        ],
        // 添加设备
        addDevice: [
            {
                name: 'deviceType',
                value: null,
                required: false,
                inputType: 'select',
                list: [{value: '0', label: 'label-0'},{value: '1', label: 'label-1'},{value: '2', label: 'label-2'}],
                label: '设备类型'
            },
            {
                name: 'deviceNumber',
                value: '',
                required: false,
                inputType: 'input',
                label: '设备数量'
            }
        ],
        // 备份addDevice
        addDeviceArr: [],
        formInitialValues: {
            orderType: 0,
            radioGroup: '2',
            class: 0,
            serviceMode: 0,
            payType: 0,
            InstallationObject: 0
        },
        // 唯一的id
        uniqueID: 0,
        // select 下拉选择信息
        selectDropMenuData: []
        
    },
    reducers: {
        save(state, { payload }) {
            Object.keys(payload).forEach(item => {
                state[item] = payload[item]
            })
        },
        // 备份appointmentTime、addDevice
        copyAppointmentTime(state) {
            state.appointmentTimeCopy = [...state.appointmentTime]
            state.addDeviceArr = [[...state.addDevice]]
        },
        // 切换订单类型
        changeOrderType(state, { payload }){
            const { orderType } = payload
            state.currentType = orderType

            switch(orderType) {
                case 0: 
                    // 新装
                    state.appointmentTime.push(state.orderContract[0])
                    state.appointmentTime.unshift(state.newInstall[0])

                    break;
                case 1:             
                    // 检修
                    state.appointmentTime = state.appointmentTimeCopy

                    break;
                case 2:             
                    // 加装
                    state.appointmentTime = [...state.appointmentTimeCopy, ...state.orderContract]

                    break;
                case 3: 
                    // 拆装
                    state.appointmentTime = state.appointmentTimeCopy
                    break;
                default: break;
            }
        },
        // 添加与删除设备信息
        changeDvList(state, { payload }) {
            const { type, index } = payload
            const arr = JSON.parse(JSON.stringify(state.addDeviceArr))
            if(type === 'add') {
                const newArr = JSON.parse(JSON.stringify(state.addDevice)) 
                // 使form的name唯一
                newArr.forEach(item => (item.name += state.uniqueID))
                state.uniqueID ++
                state.addDeviceArr = [...arr, newArr]
            } else {
                arr.splice(index, 1)
                state.addDeviceArr = arr
            }
        },
        // 修改设备数据
        changeListValue(state, { payload }) {
            const {value, firstLVIndex, secondLVIndex} = payload
            const newArr = JSON.parse(JSON.stringify(state.addDeviceArr))
            newArr[firstLVIndex][secondLVIndex].value = value
            state.addDeviceArr = newArr
        },
        // 选择公司相关信息
        chooseCompanyDetail(state, { payload }) {
            const { name, value } = payload
            console.log('payload', payload)
        },
        // 修改公司相关信息时重置部分表单
        changeList(state, { payload }) {
            const { name } = payload
            let arr = 'all'
            switch(name) {
                    case 'clientName':
                        arr = ['clientType', 'clientRegion', 'linkmanRole', 'linkmanPosition', 'phone']
                        break;               
                    case 'linkman':
                        arr = ['linkmanRole', 'linkmanPosition', 'phone']
                        break;
                default: 
                    arr = 'all'
                    break;
            }
            
            if(arr === 'all') {
                state.company.forEach(item => {
                    if(item.name !== 'companyName') {
                        if(item.inputType === 'select') {
                            item.list = []
                            item.value = null
                        } else {
                            item.value = null
                        }
                    }
                })
            } else {
                state.company.forEach(item => {
                    if(arr.includes(item.name)){
                        if(item.inputType === 'select') {
                            item.list = []
                            item.value = null
                        } else {
                            item.value = null
                        } 
                    }
                })
            }
        }
    },
    // 请求异步
    extraReducers: (b) => {
        b.addCase(submitData.fulfilled, (state, { payload }) => {
            console.log('submitData fulfilled', state, payload)
        })
        b.addCase(submitData.rejected, (state, { payload }) => {
            console.log('submitData rejected', state, payload)
        })

        b.addCase(getCompanyData.fulfilled, (state, { payload }) => {
            console.log('getCompanyData fulfilled', payload)
            const arr =  payload.Result.map(item => ({value: item.CustomerCompanyId, label: item.CustomerCompanyName}))
           
            state.company[0].list =  arr
        })
        b.addCase(getCompanyData.rejected, (state, { payload }) => {
            // console.log('getCompanyData rejected', state, payload)
        })

        b.addCase(getClientNameData.fulfilled, (state, { payload }) => {
            console.log('getClientNameData fulfilled', payload)
            const clientNameList = [], clientTypeList = [], clientRegionList = []
            payload.Result.forEach(item => {
                clientNameList.push({value: item.CustomerId, label: item.CustomerName})
                clientTypeList.push({value: item.CustomerTypeId, label: item.CustomerType})
            })
            state.company[1].list =  clientNameList
            state.company[2].list =  clientRegionList
            state.company[3].list =  clientTypeList
        })
        b.addCase(getClientNameData.rejected, (state, { payload }) => {
            // console.log('getClientNameData rejected', state, payload)
        })

    }
})

console.log('jtkfSlice', jtkfSlice)

export default jtkfSlice;
export const { save } = jtkfSlice.actions