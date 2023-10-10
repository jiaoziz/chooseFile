// 接受主线程传来的参数
self.addEventListener('message', async (e) => {
	const { type, data } = e.data
	// 生成文件树
	if (type === 'creatTree') {
		self.postMessage({ type, data: await creatTreeFun(data) })
	}

	// 读取文件
	if (type === 'clickNode') {
		await getFileDetail(data, type, self.postMessage)
	}

	// 写入文件
	if(type === 'saveText') {
		const result = await writableFile(data.fileSystemFileHandle, data.content)
		self.postMessage({ type, data: result })
	}
})

// 写入文件
const writableFile =async (data, content)=>{
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
	// reader.readAsText(file, 'UTF-8');
	// reader.onload = () => {
		// 	console.log('reader.result', reader.result);
		// 	callback({type, data: {
			// 		result: reader.result,
	// 		fileSystemFileHandle: data,
	// 		fileName: data.name
	// 	}})
	// };
	
	reader.readAsArrayBuffer(file);
	reader.onload =function(loadEvent) {
		const arrayBuffer = loadEvent.target["result"];
		callback({type, data: {
			result: arrayBuffer,
			fileSystemFileHandle: data,
			fileName: data.name
		}})
	};
}

// 生成文件树
const creatTreeFun = async (data) => {

	const creatTree = async (res, lv = '0') => {
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
					type: 'directory'
				})

			}
			if (value.kind == 'file') {
				// const valueFile = await value.getFile()
				// reader.readAsText(valueFile);
				arr.push({
					title: key,
					key: lv + key,
					child: value,
					type: 'file',
					children: []
				})
			}
		}
		return arr
	}

	const result = await creatTree(data)
	return result
}
