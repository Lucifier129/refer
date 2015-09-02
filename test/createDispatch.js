import { createDispatch } from '../src'
import expect from 'expect'

describe('test createDispatch.js', () => {
	describe('createDispatch must return a function', () => {
		it('should return function', () => {
			expect(typeof createDispatch({})).toBe('function')
		})
	})
	describe('test dipsatch cases', () => {
		it('should return value without error by normal style', () => {
			let table = {
				test_fn(value){
					return value
				},
				test_str: 'test_fn',
				test_arr: [value => value],
				test_obj: {
					a(value) {
						return value
					},
					b(value) {
						return value
					},
					c(value) {
						return value
					},
				},
				test_num: 1,
				1 : value => 1
			}
			let dispatch = createDispatch(table)

			expect(dispatch('test_num', 1)).toBe(1)
			expect(dispatch(1, 3123)).toBe(1)
			expect(dispatch('test_fn', 2)).toBe(2)
			expect(dispatch('test_str', 3)).toBe(3)
			expect(dispatch('test_arr', 4)).toBe(4)
			expect(dispatch('test_obj', 5)).toEqual({
				a: 5,
				b: 5,
				c: 5
			})
			expect(dispatch({
				a: 'test_fn',
				b: 'test_str',
				c: 'test_num',
				d: 'test_arr'
			}, 111)).toEqual({
				a: 111,
				b: 111,
				c: 1,
				d: 111
			})
		})

		it('should return value without error by complex style', () => {
			let ADD = x => x + 1
			let REDUCE = x => x - 1
			let table = {
				ADD,
				REDUCE,
				ADD3: ['ADD', ADD, 'ADD'],
				ADD4: ['ADD3', 'ADD'],
				ADD5: ['ADD4', REDUCE, 'ADD', ADD],
				PACK: {
					a: 'ADD',
					b: 'ADD3',
					c: 'ADD4',
					d: 'ADD5'
				},
				PACK1: ['ADD', 'PACK']
			}
			let dispatch = createDispatch(table)

			expect(dispatch('ADD', 0)).toBe(1)
			expect(dispatch('REDUCE', 1)).toBe(0)
			expect(dispatch('ADD3', 0)).toBe(3)
			expect(dispatch('ADD4', -4)).toBe(0)
			expect(dispatch('ADD5', 5)).toBe(10)
			expect(dispatch('PACK', 0)).toEqual({
				a: 1,
				b: 3,
				c: 4,
				d: 5
			})
			expect(dispatch('PACK1', 0)).toEqual({
				a: 2,
				b: 4,
				c: 5,
				d: 6
			})
		})

		it('should return value without error by async promise style', done => {
			let ADD = x => x + 1
			let REDUCE = x => x - 1
			let ASYNC_ADD = x => new Promise(resolve => resolve(x + 1))
			let ASYNC_REDUCE = x => new Promise(resolve => resolve(x - 1))
			let table = {
				ADD,
				ASYNC_ADD,
				REDUCE,
				ASYNC_REDUCE,
				ADD2: ['ADD', 'ADD'],
				ADD3: ['ADD', 'ASYNC_ADD', 'ASYNC_ADD'],
				ADD4: [ADD, ADD, ADD, 'ASYNC_REDUCE', 'ADD', ADD],
				REDUCE2: ['REDUCE', 'ASYNC_REDUCE']
			}
			let dispatch = createDispatch(table)

			expect(dispatch('ADD', 9)).toBe(10)
			expect(dispatch('REDUCE', 11)).toBe(10)
			expect(dispatch('ADD2', -2)).toBe(0)

			let case1 = dispatch('ASYNC_ADD', 9)
			let case2 = dispatch('ADD3', 7)
			let case3 = dispatch('ASYNC_REDUCE', 11)
			let case4 = dispatch('REDUCE2', 12)
			let case5 = dispatch('ADD4', 6)

			Promise.all([case1, case2, case3, case4, case5])
			.then(results => results.forEach(result => expect(result).toBe(10)))
			.then(() => done())
			.catch(err => console.log(err))
		})
	})
})