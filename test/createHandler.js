import { createHandler } from '../src'
import expect from 'expect'
import { inspect } from 'util'

describe('test createHandler', () => {
	it('should return an array without error', () => {
		let handler = createHandler()
		expect(Array.isArray(handler)).toBe(true)
	})
	it('should add a function item by invoking method#then without error', () => {
		let handler = createHandler(x => x + 1)
		expect(handler.length).toBe(1)
		expect(typeof handler[0]).toBe('function')
	})
	it('should add some item by invoking method#then without error', () => {
		let handler = createHandler(1, 2, 3, 4, 5)
		expect(handler.length).toBe(5)
		expect(typeof handler[0]).toBe('number')
	})
	it('should add a function item by method#then without error', () => {
		let handler = createHandler()
		handler.then(x => x + 1)
		expect(handler.length).toBe(1)
		expect(typeof handler[0]).toBe('function')
	})
	it('should add a string item by method#then without error', () => {
		let handler = createHandler()
		handler.then('test')
		expect(handler.length).toBe(1)
		expect(typeof handler[0]).toBe('string')
	})
	it('should add an array item by method#then without error', () => {
		let handler = createHandler()
		handler.then(['test'])
		expect(handler.length).toBe(1)
		expect(Array.isArray(handler[0])).toBe(true)
	})
	it('should add a promise style item by method#then without error', () => {
		let handler = createHandler()
		handler.then(x => x + 1, error => error)
		expect(handler.length).toBe(1)
		expect(typeof handler[0]).toBe('function')
	})
	it('should add items by chain style without error', () => {
		let handler = createHandler()
		.then(1)
		.then(2)
		.then(3)
		.then(4)
		.then(x => x, e => e)
		.then(x => x)
		.then('string')
		.then([])
		expect(handler.length).toBe(8)
	})
	it('should add some item by method#pipe without error', () => {
		let handler = createHandler()
		.pipe(1, 2, 3, 4, 5, 6)
		expect(handler.length).toBe(6)
	})
})