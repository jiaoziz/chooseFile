const fun =()=> {
    return new Worker('./myWorker.js')
}

export default fun;