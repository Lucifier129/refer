import { createStore, createLogger } from 'refer'
import { record } from './action'

let handler = {
	RECORD: record
}

let options = {
	scope: 'Footer',
	debug: true
}

export default () => createStore([handler, createLogger(options)], {
	footer: []
})