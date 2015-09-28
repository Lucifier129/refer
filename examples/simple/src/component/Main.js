import React, { Component } from 'react'
export default class Main extends Component {
	handleChange(e) {
		let { dispatch } = this.props
		dispatch('RECORD', e.currentTarget.value)
	}
	render() {
		let { text } = this.props
		return <input type="text" onChange={e => this.handleChange(e)} />
	}
}