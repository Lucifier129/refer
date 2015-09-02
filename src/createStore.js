import { isThenable, isFn, isObj } from './types'
import { SHUOLD_DISPATCH, DISPATCH, WILL_UPDATE, SHUOLD_UPDATE, DID_UPDATE, THROW_ERROR } from './constants'

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
	let getNextState = f => f(currentState)
	let replaceState = nextState => {
		if (!isObj(nextState)) {
			throw new Error(`The next state must be a object type, not ${ nextState }`)
		}
		currentState = nextState
		listeners.forEach(listener => listener())
		return currentState
	}
	let updateCurrentState = data => {
		if (rootDisaptch(SHUOLD_UPDATE, data) !== false) {
			rootDisaptch(WILL_UPDATE, data)
			replaceState(data.nextState)
			rootDisaptch(DID_UPDATE, data)
		}
		return currentState
	}

	let isDispatching = false
	let dispatch = (key, value) => {
		if (isDispatching) {
			throw new Error('handler may not dispatch anything.')
		}

		if (rootDisaptch(SHUOLD_DISPATCH, { key, value }) === false) {
			return currentState
		}

		rootDisaptch(DISPATCH, { key, value })

		let nextState
		try {
			isDispatching = true
			nextState = rootDisaptch([key, getNextState], value)
		} catch(error) {
			rootDisaptch(THROW_ERROR, error)
	    	return currentState
	    } finally {
	    	isDispatching = false
	    }

	    if (isThenable(nextState)) {
	    	return nextState
	    		.then(next => updateCurrentState({ currentState, next, key, value }))
	    		.catch(error => rootDisaptch(THROW_ERROR, error))
	    } else {
	    	return updateCurrentState({ currentState, nextState, key, value })
	    }

	}

	return {
		dispatch,
		getState,
		replaceState,
		subscribe
	}
}

export default createStore