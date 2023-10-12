// 接受主线程传来的参数
self.addEventListener('message', async (e) => {
	const { type, data } = e.data

	switch(type) {
		case 'creatTree':
			// 生成文件树
			self.postMessage({ type, data: await creatTreeFun(data) })
			break;
		
		case 'clickNode':
			// 读取文件
			await getFileDetail(data, type, self.postMessage)
			break;
			
		case 'saveText':
			// 写入文件
			const result = await writableFile(data.fileSystemFileHandle, data.content)
			self.postMessage({ type, data: result })
			break;

		case 'clickMenuItem':
			// 点击右键菜单
			const clickMenuItemResult = await clickMenuItem(data)
			self.postMessage({ type, data: { clickMenuItemResult, key: data.key } })
			break;

		default: break;

	}
})

// 写入文件
const writableFile = async (data, content)=>{
	try {
		// 创建一个 FileSystemWritableFileStream 用来写入。
		const writable = await data.createWritable();
		// 将文件内容写入到流中。
		await writable.write(content);
		
		// 关闭文件并将内容写入磁盘。
		await writable.close();
	
		return {status: true, message: '保存成功'}
		
	} catch (error) {
		console.log('save error', error)
		return {status: false, message: '保存失败'}
	}
}

// 读取点击的node节点文件
const getFileDetail = async (data, type, callback, convertToHtml) => {

	const file =await data.getFile()
	
	const reader = new FileReader();
	reader.readAsText(file, 'UTF-8');
	reader.onload = () => {
		console.log('reader.result', reader.result);
		callback({type, data: {
			result: reader.result,
			fileSystemFileHandle: data,
			fileName: data.name
		}})
	};
}

// 生成文件树
const creatTreeFun = async (data) => {

	/**
	 * 
	 * @param {FileSystemDirectoryHandle | FileSystemFileHandle} res 父级节点句柄信息
	 * @param {String} lv 渲染的树节点层级
	 * @returns 
	 */
	const creatTree = async (res, lv = '0' ) => {
		const arr = []
		// 是否还有文件或文件夹
		const flag = await res.entries().next();
		// debugger
		if (flag.done) return arr;
		for await (const item of res.entries()) {
			const [key, value] = item
			if (value.kind == 'directory') {
				arr.push({
					title: key,
					key: lv + key,
					children: await creatTree(value, lv + key),
					type: 'directory',
					parentNodeDetail: res,
					selfNodeDetail: value,
				})
			}
			if (value.kind == 'file') {
				arr.push({
					title: key,
					key: lv + key,
					child: value,
					type: 'file',
					children: [],
					parentNodeDetail: res,
					selfNodeDetail: value,
				})
			}
		}
		return arr
	}

	const result = await creatTree(data)
	return result
}

// 点击文件树右键菜单
const clickMenuItem = async (data) => {
	const { key, newTitle, title, selfNodeDetail, parentNodeDetail, isDirectory } = data
	let result = {}
	switch(key) {
		case 'createFile':
			// 创建子级新的空文件
			try {
				let newFile = await selfNodeDetail.getFileHandle(newTitle, { create: true });
				// console.log('newFile', newFile)
				result = { status: true, message: '创建成功' }
			} catch (err) {
				console.log('createDirectory err', err)
				if(err.toString().indexOf('The path supplied exists') !== -1) {
					result = { status: false, message: '重复命名' }
				}
			}
			break;

		case 'createDirectory': 
			// 创建子级新的空文件夹
			try {
				let newDirectory =await selfNodeDetail.getDirectoryHandle(newTitle, { create: true });
				result = { status: true, message: '创建成功' }
			} catch (err) {
				console.log('createDirectory err', err)
				if(err.toString().indexOf('The path supplied exists') !== -1) {
					result = { status: false, message: '重复命名' }
				}
			}
			break;

		case 'deleteFile':
			try {
				if(isDirectory) {
					// 删除文件夹, recursively (i.e. it will delete all within it as well)
					const deleteResult = parentNodeDetail.removeEntry(title, { recursive: true });
				} else {
					// 删除文件
					const deleteResult = parentNodeDetail.removeEntry(title);
					console.log('delete result', deleteResult)
				}
				result = { status: true, message: '删除成功' }
			} catch (error) {
				result = { status: false, message: '删除失败' }
			}

			break;
		default: break;
	}

	return result;

}
