// 客服系统
const token1 = `eyJVc2VyTmFtZSI6IuW8oOWbvea1qSIsIlVzZXJJZCI6NDI5LCJSb2xlIjoi6LaF57qn566h55CG5ZGYIiwiUm9sZUlkIjoxMSwiQ29tcGFueUlkIjozLCJXYXJlaG91c2VQb29sSWQiOjUsIlR5cGUiOiJQYyJ9`
// 土建通
const token2 = 'hrtz4mHVbdx/huRimyiVF6cFsXLDYuds1kPCSi66PrYskBGBDvp3+w=='

// 解析query数据
function queryParse(query){
    let queryText = "";
    for(let key in query){
        queryText += `${key}=${query[key]}&`;
		}
    return queryText.slice(0,-1);
}

// 解析params数据
function paramsParse(params){
    // let paramsText = `token=${token2}&`
    let paramsText = `token=${token2}&`
    for (let key in params) {
        paramsText += `${key}=${params[key]}&`
    }
    return paramsText.length > 0 ? "?" + paramsText  : paramsText
}


function request(url, method, data){
    // 区分大小写，一律转成大写
    method = method.toUpperCase()
    // 解决浏览器兼容性
    let xhr = new XMLHttpRequest()
    return new Promise((resolve, reject) => {
        // GET请求
        if (method === "GET") {
            url = url + paramsParse(data)
            xhr.open(method, url, true)
            xhr.send(null)
            xhr.onreadystatechange = function () {
                try {
                    if (xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText)
                        resolve(data)
                    } else {
                        reject({
                            status: xhr.status,
                            msg: '请求出错'
                        })
                    }
                } catch(err) {

                }
            }
            return
        }
        // POST请求
        if(method === "POST"){
            xhr.open(method, url, true)
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
            xhr.send(queryParse(data))
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText)
                    resolve(data)
                } else {
                    reject({
                        status: xhr.status,
                        msg: '请求出错'
                    })
                }
            }
            return
        }
    })

}

export default request;