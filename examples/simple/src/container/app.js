import React, { Component } from 'react'
import Main from '../component/Main'
import { dispatch, getState, subscribe } from '../store'

export default class App extends Component {
	render() {
		return (<div>
				<Main dispatch={ dispatch } />
			</div>)
	}
}
