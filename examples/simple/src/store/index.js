import { createStore, createLogger } from 'refer'
import * as handlers from '../handlers'

let options = {
	scope: 'Root',
	debug: true
}

console.log(handlers)

export default createStore([handlers, createLogger(options)], {
	text: []
})