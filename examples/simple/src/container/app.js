import React, { Component } from 'react'
import Header from '../component/header'
import Main from '../component/main'
import Footer from '../component/footer'

export default class App extends Component {
	render() {
		let { dispatch } = this.props
		return (<div>
				<Header dispatch={ dispatch } />
				<Main dispatch={ dispatch } />
				<Footer dispatch={ dispatch } />
			</div>)
	}
}
