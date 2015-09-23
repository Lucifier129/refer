import { createStore, createLogger } from 'refer'

let handler = {
	RECORD: source => state => Object.assign({}, state, source)
}

let options = {
	scope: 'Root',
	debug: true
}

export default createStore([handler, createLogger(options)], {})