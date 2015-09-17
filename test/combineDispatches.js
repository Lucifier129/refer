import { combineHandlers, createStore, createDispatch, combineDispatches, constants } from '../src'
import expect from 'expect'
import handlers from './helper/handlers'
import { ADD_ITEM, DELETE_ITEM, DELETE_ITEMS, UPDATE_ITEM, UPDATE_ITEMS } from './helper/constants'

let { WILL_UPDATE, DID_UPDATE, SHOULD_DISPATCH, SHOULD_UPDATE, THROW_ERROR } = constants

let logger = {
	[WILL_UPDATE]: ({ key, value }) => {
		console.time(key)
	},
	[DID_UPDATE]: ({ key, value }) => {
		console.timeEnd(key)
		console.log(`action ${ key } start, the value: ${ JSON.stringify(value) }`)
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
		var store01 = createStore([handler01, storager, logger], 0)
		var store02 = createStore([handler02, storager, logger], 0)
		var dispatch = combineDispatches(store02.dispatch, store01.dispatch)
		dispatch('add', 1)
		console.log(store01.getState(), store02.getState())
	})
	it('should compose state witchout error', () => {
		var rootInitState = {
			index: [],
			list: [],
			detail: []
		}
		var rootHandler = {
			ADD_ITEM: sourc => state => Object.assign({}, state)
		}
		var rootStore = createStore()
	})
})