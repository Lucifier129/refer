import { combineHandlers, createDispatch } from '../src'
import expect from 'expect'

describe('test combineHandlers.js', () => {
	let part01 = {
		ADD_ITEM: text => ({ text }),
		ADD_NAME: name => name.split(' ')
	}
	let part02 = {
		ADD_ITEM: data => {
			data.id = new Date().getTime()
			return data
		},
		ADD_NAME: ([firstName, lastName]) => ({ firstName, lastName })
	}
	let part03 = {
		ADD_ITEM: data => {
			data.state = false
			return data
		},
		GET_TIME: () => new Date()
	}
	
	it('should combineHandlers and dispatch value without error', () => {
		let handlers = combineHandlers(part01, part02, part03)
		let dispatch = createDispatch(handlers)
		let result = dispatch('ADD_ITEM', 'test')
		Object.keys(result).forEach(key => {
			switch (key) {
				case 'id':
					expect(result[key]).toExist()
					break
				case 'text':
					expect(result[key]).toBe('test')
					break
				case 'state':
					expect(result[key]).toBe(false)
					break
			}
		})

		let name = dispatch('ADD_NAME', 'Jade Gu')
		expect(name.firstName).toBe('Jade')
		expect(name.lastName).toBe('Gu')

		let date = dispatch('GET_TIME')
		expect(date instanceof Date).toBe(true)
	})
})