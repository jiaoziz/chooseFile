const run = () => {
    console.log('run')
    return 1
}

const fn1 = (num) => {
    console.log('fn1', num + 1)
    return num + 1
}

const fn2 = (num) => {
    console.log('fn2', num + 2)
    return num + 2
}

const fn3 = (num) => {
    console.log('fn3')
    return num + 3
}


class Fn {
    constructor() {
        this.runData = null
    }

    use(func) {
        this.runData =  typeof func == 'function' ? func(this.runData) : func
        return this
    }
}

const result = new Fn().use(run).use(fn1).use(fn2).use(fn3)
console.log(result.runData)

// 链式调用
