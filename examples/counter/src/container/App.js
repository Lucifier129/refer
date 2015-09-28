import React, { Component } from 'react'
import Counter from '../component/Counter'
import { dispatch, getState, subscribe } from '../store'

let increment = () => dispatch('COUNT', 'INCREMENT')
let decrement = () => dispatch('COUNT', 'DECREMENT')
let incrementIfOdd = () => dispatch('COUNT', 'INCREMENT_IF_ODD')

export default class App extends Component {
	componentDidMount() {
		this.unsubscribe = subscribe(() => this.forceUpdate())
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	render() {
		return <Counter
			increment={ increment }
			decrement={ decrement }
			incrementIfOdd={ incrementIfOdd }
			count={getState()} />
	}
}
