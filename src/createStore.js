import { isThenable, isFn, isObj, isArr } from './types'
import combineHandlers from './combineHandlers'
import createDispatch from './createDispatch'
import mapValues from './mapValues'
import * as LIFE_CYCLE from './constants'

const { 
	GET_TABLE,
	SHOULD_DISPATCH,
	DISPATCH,
	WILL_UPDATE,
	SHOULD_UPDATE,
	DID_UPDATE,
	THROW_ERROR,
	ASYNC_START,
	ASYNC_END,
	SYNC
} = LIFE_CYCLE

let createStore = (innerDispatch, initialState = {}) => {

	if (isArr(innerDispatch)) {
		innerDispatch = createDispatch(combineHandlers(...innerDispatch))
	} else if (isObj(innerDispatch)) {
		innerDispatch = createDispatch(innerDispatch)
	}

	if (!isFn(innerDispatch)) {
		throw new Error(`Expected the innerDispatch to be a function which is ${ innerDispatch }`)
	}

	let listeners = []
	let subscribe = listener => {
		listeners.push(listener)
		return () => {
			let index = listeners.indexOf(listener)
			if (index !== -1) {
				listeners.splice(index, 1)
			}
		}
	}

	let currentState = initialState
	let replaceState = (nextState, silent) => {
		currentState = nextState
		if (!silent) {
			listeners.forEach(listener => listener())
		}
	}
	let updateCurrentState = data => {
		if (innerDispatch(SHOULD_UPDATE, data) !== false) {
			innerDispatch(WILL_UPDATE, data)
			replaceState(data.nextState)
			innerDispatch(DID_UPDATE, data)
		}
	}

	let getState = () => currentState
	let getNextState = f => f(currentState)
	let dispatchError = error => Promise.reject(innerDispatch(THROW_ERROR, error))

	let isDispatching = false
	let dispatch = (key, value) => {
		if (isDispatching) {
			throw new Error(`store.dispatch(key, value): handler may not dispatch`)
		}

		let currentData = { currentState, key, value }

		if (innerDispatch(SHOULD_DISPATCH, currentData) === false) {
			return currentState
		}

		innerDispatch(DISPATCH, currentData)

		let nextState
		try {
			isDispatching = true
			nextState = innerDispatch([key, getNextState], value)
		} catch(error) {
	    	return dispatchError(error)
	    } finally {
	    	isDispatching = false
	    }

	    if (nextState === currentState) {
	    	return currentState
	    }

	    let data = { currentState, nextState, key, value }

	    if (!isThenable(nextState)) {
	    	updateCurrentState(data)
	    	innerDispatch(SYNC, data)
	    	return currentState
	    }

	    innerDispatch(ASYNC_START, data)
	    return nextState.then(nextState => {
	    	let data = { currentState, nextState, key, value }
	    	updateCurrentState(data)
	    	innerDispatch(ASYNC_END, data)
	    	return currentState
	    }).catch(error => {
	    	innerDispatch(ASYNC_END, { currentState, key, value, error })
	    	return dispatchError(error)
	    })
	}



	let createActions = obj => mapValues(obj, (_, key) => value => 
		LIFE_CYCLE.hasOwnProperty(key) ? innerDispatch(key, value) : dispatch(key, value)
	)
	let actions = createActions(innerDispatch(GET_TABLE))

	return {
		dispatch,
		actions,
		getState,
		replaceState,
		subscribe,
		createActions
	}
}

export default createStore