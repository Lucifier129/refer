import { createStore, createLogger } from 'refer'
import * as handlers from '../handlers'

let options = {
	debug: true
}

export default createStore([handlers, createLogger(options)], 0)