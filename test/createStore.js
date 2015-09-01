import combineHandlers from '../src/combineHandlers'
import createStore from '../src/createStore'
import expect from 'expect'

import handlers from './helper/handlers'
import { ADD_ITEM, DELETE_ITEM, DELETE_ITEMS, UPDATE_ITEM, UPDATE_ITEMS } from './helper/constants'

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
		let rootDispatch = combineHandlers(...handlers)
		let store = createStore(rootDispatch, { todos: []})
		let { dispatch, getState } = store

		it('should add item without error', () => {
			console.time(ADD_ITEM)
			dispatch(ADD_ITEM, 'test add')
			console.timeEnd(ADD_ITEM)
			expect(getState().todos[0].text).toBe('test add')
		})
		it('should delete item without error', () => {
			let id = getState().todos[0].id
			console.time(DELETE_ITEM)
			dispatch(DELETE_ITEM, id)
			console.timeEnd(DELETE_ITEM)
			expect(getState().todos.length).toBe(0)
		})
		it('should add items without error', () => {
			let texts = ['a', 'b', 'c', 'd', 'e']
			console.time('ADD_ITEMS')
			texts.forEach(text => dispatch(ADD_ITEM, text))
			console.timeEnd('ADD_ITEMS')
			expect(getState().todos.length).toBe(texts.length)
		})
		it('should update item without error', () => {
			let source = {
				id: getState().todos[0].id,
				status: true,
				text: 'new text'
			}
			console.time(UPDATE_ITEM)
			dispatch(UPDATE_ITEM, source)
			console.timeEnd(UPDATE_ITEM)
			Object.keys(source).forEach(key => {
				expect(getState().todos[0][key]).toBe(source[key])
			})
		})
		it('should update items without error', () => {
			let source = {
				status: true
			}
			console.time(UPDATE_ITEMS)
			dispatch(UPDATE_ITEMS, source)
			console.timeEnd(UPDATE_ITEMS)
			getState().todos.forEach(item => expect(item.status).toBe(source.status))
		})
		it('should delete items without error', () => {
			let query = {
				status: true
			}
			console.time(DELETE_ITEMS)
			dispatch(DELETE_ITEMS, query)
			console.timeEnd(DELETE_ITEMS)
			expect(getState().todos.length).toBe(0)
		})
	})
})