import React, { Component } from 'react'
import { RECORD } from './constant'

export default class View extends Component {
	handleChange(e) {
		let { dispatch } = this
		console.time('input')
		dispatch(RECORD, e.currentTarget.value)
		console.timeEnd('input')
		return
		dispatch([v => {
			if (Math.random() > 0.5) {
				return v
			}
			throw new Error('input error')
		}, RECORD], e.currentTarget.value)
	}
	render() {
		return <input type="text" onChange={e => this.handleChange(e)} />
	}
}