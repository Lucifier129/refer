import React, { Component } from 'react'
import Counter from '../component/Counter'
import { getState, subscribe, actions } from '../store'

Component.prototype.$actions = actions

export default class App extends Component {
	componentWillUpdate(nextProps, nextState) {
		var isProps = this.props === nextProps
		var isState = this.state === nextState
		console.log('componentWillUpdate', 'app')
	}
	componentDidUpdate() {
		this;
		console.log('componentDidUpdate', 'app')
	}
	componentWillMount() {
	}
	componentDidMount() {
		console.log('app didMount')
		this.unsubscribe = subscribe(() => this.forceUpdate())
		//debugger
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	render() {
		return <Counter ref="counter" count={getState()} />
	}
}
