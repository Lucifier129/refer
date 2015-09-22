import { createStore, logger } from 'refer'
import * as handler from './handler'

let loggerOptions = {
	scope: 'Input',
	debug: true
}
export default createStore([handler, logger(loggerOptions)])