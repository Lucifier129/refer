import { combineHandlers, createStore, constants } from '../src'
import expect from 'expect'
import handlers from './helper/handlers'
import { ADD_ITEM, DELETE_ITEM, DELETE_ITEMS, UPDATE_ITEM, UPDATE_ITEMS } from './helper/constants'


let { WILL_UPDATE, DID_UPDATE, SHOULD_DISPATCH, SHOULD_UPDATE, THROW_ERROR } = constants

let getStore = (...middlewares) => {
	let rootDispatch = combineHandlers(...handlers.concat(middlewares))
	let store = createStore(rootDispatch, { todos: []})
	return store
}

let logger = {
	[WILL_UPDATE]: ({ key, value }) => {
		console.time(key)
		console.log(`action ${ key } start, the value: ${ JSON.stringify(value) }`)
	},
	[DID_UPDATE]: ({ key, value }) => {
		console.timeEnd(key)
	}
}

logger = {}

let filter = {
	[SHOULD_DISPATCH]: ({ key, value }) => {
		if (key === ADD_ITEM && value === '') {
			return false
		}
	},
	[SHOULD_UPDATE]: ({ nextState }) => {
		if (nextState.skip) {
			return false
		}
	}
}

describe('test createStore.js', () => {
	it('should return an object', () => {
		let store = createStore((key, value) => getState => getState(), {})
		expect(typeof store).toBe('object')
		expect(typeof store.dispatch).toBe('function')
		expect(typeof store.getState).toBe('function')
		expect(typeof store.replaceState).toBe('function')
		expect(typeof store.subscribe).toBe('function')
	})

	describe('test store.dispatch', () => {
		let { dispatch, getState } = getStore(logger)

		it('should add item without error', () => {
			dispatch(ADD_ITEM, 'test add')
			expect(getState().todos[0].text).toBe('test add')
		})

		it('should delete item without error', () => {
			let id = getState().todos[0].id
			dispatch(DELETE_ITEM, id)
			expect(getState().todos.length).toBe(0)
		})
		it('should add items without error', () => {
			let texts = ['a', 'b', 'c', 'd', 'e']
			texts.forEach(text => dispatch(ADD_ITEM, text))
			expect(getState().todos.length).toBe(texts.length)
		})
		it('should update item without error', () => {
			let source = {
				id: getState().todos[0].id,
				status: true,
				text: 'new text'
			}
			dispatch(UPDATE_ITEM, source)
			Object.keys(source).forEach(key => {
				expect(getState().todos[0][key]).toBe(source[key])
			})
		})
		it('should update items without error', () => {
			let source = {
				status: true
			}
			dispatch(UPDATE_ITEMS, source)
			getState().todos.forEach(item => expect(item.status).toBe(source.status))
		})
		it('should delete items without error', () => {
			let query = {
				status: true
			}
			dispatch(DELETE_ITEMS, query)
			expect(getState().todos.length).toBe(0)
		})
	})

	describe('test store.dispatch by advanced mode', () => {
		let { dispatch, getState } = getStore(logger, filter)

		it('shuold skip ADD_ITEM action if the value is empty string', () => {
			dispatch(ADD_ITEM, '')
			expect(getState().todos.length).toBe(0)
			dispatch(ADD_ITEM, 'ONE')
			expect(getState().todos.length).toBe(1)
		})

		it('shuold skip next state if its skip property is true', () => {
			let currentState = getState()
			dispatch([DELETE_ITEM, f => state => ({ skip: true })], currentState.todos[0].id)
			expect(getState()).toBe(currentState)
		})
	})

	describe('test store.dispatch by async mode', () => {
		let delay = times => value => new Promise(resolve => 
			setTimeout(() => resolve(value), times)
		)

		it('should ADD_ITEM on async without error', done => {
			let { dispatch } = getStore(filter, logger)
			let text = 'test async add ADD_ITEM'
			dispatch([delay(20), ADD_ITEM], text)
			.then(state => expect(state.todos[0].text).toBe(text))
			.then(() => done())
		})

		it('shuold DELETE_ITEM on async without error', done => {
			let { dispatch, getState } = getStore(filter, logger)
			dispatch(ADD_ITEM, '')
			dispatch(ADD_ITEM, 'first')
			dispatch(ADD_ITEM, 'second')
			expect(getState().todos.length).toBe(2)
			let first = getState().todos[0]
			dispatch([delay(20), DELETE_ITEM], getState().todos[1].id)
			.then(state => {
				expect(state.todos.length).toBe(1)
				expect(state.todos[0]).toBe(first)
			})
			.then(() => done())
			.catch(::console.log)
		})

		it('shuold catch error from dispatcher, on async style or sync style', done => {
			let syncErrorMsg = 'test sync error'
			let asyncErrorMsg = 'test async error'
			let count = 0
			let log = x => {
				console.log(x, ' should not run this function')
				return x
			}
			let errorHandler = {
				[THROW_ERROR]: error => {
					if (count === 0) {
						expect(error.message).toBe(syncErrorMsg)
						count++
					} else {
						expect(error.message).toBe(asyncErrorMsg)
						expect(getState().todos.length).toBe(1)
						done()
					}
				}
			}
			let { dispatch, getState } = getStore(filter, logger, errorHandler)

			dispatch(ADD_ITEM, 'insert item')

			dispatch([value => {
				throw new Error(syncErrorMsg)
			}, log], null)

			dispatch([delay(20), value => {
				throw new Error(asyncErrorMsg)
			}, log], null)
		})

		it('shuold throw en error if dispatch an nonexistent action key', () => {
			let errorHandler = {
				[THROW_ERROR]: error => expect(error).toExist(true)
			}
			let { dispatch, getState } = getStore(errorHandler)
			dispatch('abc', 'abc is not the right action key')
		})
	})
})