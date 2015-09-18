import { combineHandlers, createStore, createDispatch, combineDispatches, constants } from '../src'
import expect from 'expect'
import { inspect } from 'util'
import handlers, { updateItem, addItem } from './helper/handlers'
import { ADD_ITEM, DELETE_ITEM, DELETE_ITEMS, UPDATE_ITEM, UPDATE_ITEMS } from './helper/constants'

let { WILL_UPDATE, DID_UPDATE, SHOULD_DISPATCH, SHOULD_UPDATE, THROW_ERROR } = constants

let logger = {
	[WILL_UPDATE]: ({ key, value }) => {
		console.time(inspect(key))
	},
	[DID_UPDATE]: ({key, value}) => {
		console.timeEnd(inspect(key))
		console.log(`the value: ${ inspect(value) }`)
	},
	[THROW_ERROR]: err => {
		throw err
	}
}

describe('test combineDispatches', () => {
	it('should combineDispatches without error', () => {
		var handler01 = {
			add: x => x + 1
		}
		var handler02 = {
			add: x => x + 2
		}
		var storager = {
			add: x => state => state + x
		}
		var store01 = createStore([handler01, storager], 0)
		var store02 = createStore([handler02, storager], 0)
		var dispatch = combineDispatches(store02.dispatch, store01.dispatch)
		dispatch('add', 1)
		expect(store01.getState()).toBe(2)
		expect(store02.getState()).toBe(4)
	})
	it('should compose state witchout error', () => {
		var rootHandler = {
			[ADD_ITEM]: item => state => {
				return {
					...state,
					todos: [item, ...state.todos]
				}
			},
			[UPDATE_ITEM]: source => state => {
				return {
					...state,
					todos: updateItem(source, state.todos)
				}
			}
		}
		var todoHandler = {
			[UPDATE_ITEM]: source => state => Object.assign({}, state, source),
			[ADD_ITEM]: text => state => addItem(text)
		}
		var rootStore = createStore([rootHandler], { todos: []})
		var todoStore01 = createStore([todoHandler])
		var todoStore02 = createStore([todoHandler])
		var todoStore03 = createStore([todoHandler])
		var dispatch01 = combineDispatches(rootStore.dispatch, todoStore01.dispatch)
		var dispatch02 = combineDispatches(rootStore.dispatch, todoStore02.dispatch)
		var dispatch03 = combineDispatches(rootStore.dispatch, todoStore03.dispatch)

		dispatch01(ADD_ITEM, 'first')
		dispatch02(ADD_ITEM, 'second')
		dispatch03(ADD_ITEM, 'third')

		expect(todoStore01.getState().text).toBe('first')
		expect(todoStore02.getState().text).toBe('second')
		expect(todoStore03.getState().text).toBe('third')
		expect(rootStore.getState().todos.length).toBe(3)

		dispatch01(UPDATE_ITEM, { text: 'first item change'})
		dispatch02(UPDATE_ITEM, { text: 'second item change'})
		dispatch03(UPDATE_ITEM, { text: 'third item change'})

		expect(todoStore01.getState().text).toBe('first item change')
		expect(todoStore02.getState().text).toBe('second item change')
		expect(todoStore03.getState().text).toBe('third item change')
		expect(rootStore.getState().todos.length).toBe(3)


	})
})