import { isThenable, isFn, isObj } from './types'

let createStore = (rootDisaptch, initialState = {}) => {

	if (!isFn(rootDisaptch)) {
		throw new Error('Expected the rootDisaptch to be a function.')
	}

	let listeners = []
	let subscribe = listener => {
		let index = listeners.length
		listeners.push(listener)
		return () => {
			let index = listeners.indexOf(listener)
			if (index !== -1) {
				listeners.splice(index, 1)
			}
		}
	}

	let currentState = initialState
	let getState = () => currentState
	let replaceState = nextState => {
		if (!isObj(nextState)) {
			throw new Error(`The next state must be a object type, not ${ nextState }`)
		}
		currentState = nextState
		listeners.forEach(listener => listener())
		return currentState
	}

	let isDispatching = false
	let updater = update => update(currentState)
	let dispatch = (key, value) => {
		if (isDispatching) {
	      throw new Error('reducer may not dispatch actions.');
	    }

		let nextState
		try {
	      isDispatching = true
	      nextState = rootDisaptch([key, updater], value)
	    } finally {
	      isDispatching = false
	    }

	    return isThenable(nextState) ? nextState.then(replaceState) : replaceState(nextState)
	}

	return {
		dispatch,
		getState,
		replaceState,
		subscribe
	}
}

export default createStore