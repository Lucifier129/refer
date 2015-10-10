import React, { Component } from 'react'
export default class Counter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			count: 0
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		var isProps = this.props === nextProps
		var isState = this.state === nextState
		//console.log('shouldComponentUpdate')
		return true
	}
	componentWillUpdate(nextProps, nextState) {
		var isProps = this.props === nextProps
		var isState = this.state === nextState
		//console.log('componentWillUpdate')
	}
	componentDidUpdate() {
		//console.log('componentDidUpdate')
	}
	componentWillReceiveProps() {
		//console.log('componentWillReceiveProps')
	}
	componentWillMount() {

	}
	componentDidMount() {
		console.log('counter didMount')
		// setTimeout(() => {
		// 	console.log('forceUpdate_start')
		// 	this.forceUpdate((...args) => console.log(args))
		// 	console.log('forceUpdate_end')
		// }, 1000)
	}
	componentWillUnmount() {
		debugger
	}
	render() {
		let { COUNT } = this.actions
		let { count } = this.props
		return (
			<div>
				<span ref="counter">count: { count }</span>
				{' '}
				<button onClick={ () => COUNT('INCREMENT') }>+</button>
				{' '}
				<button onClick={ () => COUNT('DECREMENT') }>-</button>
				{' '}
				<button onClick={ () => COUNT('INCREMENT_IF_ADD') }>incrementIfOdd</button>
			</div>
		)
	}
}