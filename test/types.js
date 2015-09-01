import { isObj, isArr, isFn, isStr, isNum, isThenable } from '../src/types'
import expect from 'expect'

describe('test types.js', () => {
	describe('isObj', () => {
		it('should return false', () => {
			expect(isObj(undefined)).toBe(false)
			expect(isObj(null)).toBe(false)
			expect(isObj(1)).toBe(false)
			expect(isObj('1')).toBe(false)
			expect(isObj([])).toBe(false)
			expect(isObj(() => {})).toBe(false)
			expect(isObj(/regexp/)).toBe(false)
			expect(isObj(false)).toBe(false)
		})
		it('should return true', () => {
			expect(isObj({})).toBe(true)
			expect(isObj({a:1})).toBe(true)
		})
	})
	describe('isArr', () => {
		it('should return false', () => {
			expect(isArr(undefined)).toBe(false)
			expect(isArr(null)).toBe(false)
			expect(isArr(1)).toBe(false)
			expect(isArr('1')).toBe(false)
			expect(isArr(() => {})).toBe(false)
			expect(isArr(/regexp/)).toBe(false)
			expect(isArr(false)).toBe(false)
			expect(isArr({})).toBe(false)
		})
		it('should return true', () => {
			expect(isArr([])).toBe(true)
			expect(isArr([1, 2])).toBe(true)
		})
	})
	describe('isFn', () => {
		it('should return false', () => {
			expect(isFn(undefined)).toBe(false)
			expect(isFn(null)).toBe(false)
			expect(isFn(1)).toBe(false)
			expect(isFn('1')).toBe(false)
			expect(isFn([])).toBe(false)
			expect(isFn(/regexp/)).toBe(false)
			expect(isFn(false)).toBe(false)
			expect(isFn({})).toBe(false)
		})
		it('should return true', () => {
			expect(isFn(() => {})).toBe(true)
			expect(isFn(expect)).toBe(true)
		})
	})
	describe('isStr', () => {
		it('should return false', () => {
			expect(isStr(undefined)).toBe(false)
			expect(isStr(null)).toBe(false)
			expect(isStr(1)).toBe(false)
			expect(isStr([])).toBe(false)
			expect(isStr(() => {})).toBe(false)
			expect(isStr(/regexp/)).toBe(false)
			expect(isStr(false)).toBe(false)
			expect(isStr({})).toBe(false)
		})
		it('should return true', () => {
			expect(isStr('1')).toBe(true)
			expect(isStr('1123123123')).toBe(true)
			expect(isStr('')).toBe(true)
			expect(isStr(expect.toString())).toBe(true)
		})
	})
	describe('isNum', () => {
		it('should return false', () => {
			expect(isNum(undefined)).toBe(false)
			expect(isNum(null)).toBe(false)
			expect(isNum('1')).toBe(false)
			expect(isNum([])).toBe(false)
			expect(isNum(() => {})).toBe(false)
			expect(isNum(/regexp/)).toBe(false)
			expect(isNum(false)).toBe(false)
			expect(isNum({})).toBe(false)
		})
		it('should return true', () => {
			expect(isNum(1)).toBe(true)
			expect(isNum(1.012)).toBe(true)
			expect(isNum(0)).toBe(true)
		})
	})
	describe('isThenable', () => {
		it('should return false', () => {
			expect(isThenable(undefined)).toBe(false)
			expect(isThenable(null)).toBe(false)
			expect(isThenable(1)).toBe(false)
			expect(isThenable('1')).toBe(false)
			expect(isThenable([])).toBe(false)
			expect(isThenable(() => {})).toBe(false)
			expect(isThenable(/regexp/)).toBe(false)
			expect(isThenable(false)).toBe(false)
			expect(isThenable({})).toBe(false)
			expect(isThenable({
				then: 1
			})).toBe(false)
		})
		it('should return true', () => {
			expect(isThenable({
				then() {}
			})).toBe(true)
			expect(isThenable(new Promise((resolve, reject) => {}))).toBe(true)
		})
	})
})