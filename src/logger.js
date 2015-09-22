import { isStr, isArr } from './types'
import { BUBBLE, SHOULD_BUBBLE } from './constants'

let check = key => {
	switch (true) {
		case isStr(key):
			return key
		case isArr(key) && key[0] === BUBBLE:
			return `${ BUBBLE } => ${ check(key[1]) }`
		default:
			return '@COMPLEX'
	}
}

const attr = 'info' in console ? 'info' : "log"
const timer = typeof performance !== `undefined` ? performance : Date
const pad = num => ('0' + num).slice(-2)

export default ({ scope, debug }) => {
	let getKey = key =>`${ scope }`
	let logger = {
		'@WILL_UPDATE': ({ key }) => {
			console.time(getKey(key))
		},
		'@DID_UPDATE': (data) => {
			console.count(getKey(key))
			console.timeEnd(getKey(key))
			let { key, value, currentState, nextState } = data
			const time = new Date()
      		const formattedTime = ` @ ${time.getHours()}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
      		const message = `action [${ check(key) }] at ${ formattedTime }`
			try {
				console.groupCollapsed(message)
			} catch (e) {
				try {
					console.group(message)
				} catch (e) {
					console.log(message)
				}
			}
	      
			console[attr](`%c value`, `color: #03A9F4; font-weight: bold`, value);
		    console[attr](`%c prev state`, `color: #9E9E9E; font-weight: bold`, currentState);
		    console[attr](`%c next state`, `color: #4CAF50; font-weight: bold`, nextState);

		    try {
		    	console.groupEnd()
		    } catch (e) {
		    	console.log('—— log end ——')
		    }
		},
		'THROW_ERROR': error => {
			if (debug) {
				throw error
			}
		}
	}
	return logger
}