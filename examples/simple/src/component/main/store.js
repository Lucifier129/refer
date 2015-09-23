import { createStore, createLogger } from 'refer'
import * as handler from './handler'

let options = {
	scope: 'Main',
	debug: true
}
export default () => createStore([handler, createLogger(options)])