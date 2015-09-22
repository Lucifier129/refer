import { createStore, logger } from 'refer'

let handler = {
	RECORD: source => state => Object.assign({}, state, source)
}

let loggerOptions = {
	scope: 'Root',
	debug: true
}

export default createStore([handler, logger(loggerOptions)], {})