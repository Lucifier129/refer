export let isType = type => {
    type = `[object ${ type }]`
    return obj => {
        return obj != null && Object.prototype.toString.call(obj) === type
    }
}
export let isObj = isType('Object')
export let isStr = isType('String')
export let isNum = isType('Number')
export let isFn = isType('Function')
export let isArr = Array.isArray || isType('Array')
export let isThenable = obj => {
    return obj != null && isFn(obj.then)
}