import { isFn } from './types'

let combine = (resolve, reject) => value => {
	try {
		return resolve(value)
	} catch(error) {
		return reject(error)
	}
}

let then = function(resolve, reject) {
	let item
	if (isFn(resolve) && isFn(reject)) {
		item = combine(resolve, reject)
	} else {
		item = resolve
	}
	this.push(item)
	return this
}

let pipe = function(...args) {
	this.push.apply(this, args)
	return this
}

export default (...args) => {
	let handler = [...args]
	handler.then = then
	handler.pipe = pipe
	return handler
}