import React, { Component } from 'react'

export default class View extends Component {
	render() {
		let { record } = this.props
		return <header onClick={e => record('header')}>title</header>
	}
}