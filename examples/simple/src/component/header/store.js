import { createStore, createLogger } from 'refer'
import { record } from './action'

let handler = {
	RECORD: record
}

let options = {
	scope: 'Header',
	debug: true
}

export default () => createStore([handler, createLogger(options)], {
	header: []
})