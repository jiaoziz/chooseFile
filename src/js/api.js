import request from "./request";

const baseUrl = 'http://bss.jetone.cn:8100/Api/'
const token = `eyJVc2VyTmFtZSI6IuW8oOWbvea1qSIsIlVzZXJJZCI6NDI5LCJSb2xlIjoi6LaF57qn566h55CG5ZGYIiwiUm9sZUlkIjoxMSwiQ29tcGFueUlkIjozLCJXYXJlaG91c2VQb29sSWQiOjUsIlR5cGUiOiJQYyJ9`

// 获取公司列表
export const getCompanyList = (data) => {
    return request(baseUrl + 'Customer/getCustomerCompanyList', 'get', data)
}

// 获取客户名称
export const getClientNameList = (data) => {
    return request(baseUrl + 'Customer/getCustomerByCustomerCompany', 'get', data)
}