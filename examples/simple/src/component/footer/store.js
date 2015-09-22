import { createStore, logger } from 'refer'
import { record } from './action'

let handler = {
	RECORD: record
}

let loggerOptions = {
	scope: 'Footer',
	debug: true
}

export default createStore([handler, logger(loggerOptions)], {
	footer: []
})