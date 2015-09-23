import { createStore, createLogger } from 'refer'
import * as handler from './handler'

let options = {
	scope: 'Input',
	debug: true
}

export default () => createStore([handler])