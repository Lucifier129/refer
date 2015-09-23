import { createStore, logger } from 'refer'
import * as handler from './handler'

let loggerOptions = {
	scope: 'Main',
	debug: true
}
export default () => createStore([handler, logger(loggerOptions)])