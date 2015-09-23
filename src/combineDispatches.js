import { BUBBLE } from './constants'

let identical = () => state => state
let combineDispatch = (rootDispatch, subDispatch) => (key, value) => {
	let oldState = subDispatch(identical)
	let newState = subDispatch(key, value)
	if (oldState !== newState) {
		rootDispatch([BUBBLE, key], newState)
	}
	return newState
}

export default (rootDispatch, ...subDispatches) => {
	return subDispatches.reduce(combineDispatch, rootDispatch)
}