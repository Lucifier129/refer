import React, { Component } from 'react'

export default class View extends Component {
	render() {
		let { record } = this.props
		return <footer onClick={e => record('footer')}>footer</footer>
	}
}