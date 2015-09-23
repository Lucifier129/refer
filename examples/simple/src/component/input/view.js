import React, { Component } from 'react'
import { RECORD } from './constant'

export default class View extends Component {
	handleChange(e) {
		let { dispatch } = this
		dispatch(RECORD, e.currentTarget.value)
	}
	render() {
		return <input type="text" onChange={e => this.handleChange(e)} />
	}
}