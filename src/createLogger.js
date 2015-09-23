const attr = 'info' in console ? 'info' : "log"
const pad = num => ('0' + num).slice(-2)

export default ({ scope, debug }) => {
	let logger = {
		'@DISPATCH': () => console.time(scope),
		'@DID_UPDATE': ({ key, value, currentState, nextState }) => {
			console.timeEnd(scope)
			const time = new Date()
			const formattedTime = `${time.getHours()}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`
			const message = `action [${ key }] at ${ formattedTime }`

			try {
				console.groupCollapsed(message)
			} catch (e) {
				try {
					console.group(message)
				} catch (e) {
					console.log(message)
				}
			}

			console[attr](`%c value`, `color: #03A9F4; font-weight: bold`, value)
			console[attr](`%c prev state`, `color: #9E9E9E; font-weight: bold`, currentState)
			console[attr](`%c next state`, `color: #4CAF50; font-weight: bold`, nextState)

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