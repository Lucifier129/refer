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
		console.log('componentWillUpdate', 'counter')
	}
	componentDidUpdate() {
		this;
		console.log('componentDidUpdate', 'counter')
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
		//debugger
		console.log('counter unmount')
	}
	toNum(num, callback) {
		cancelAnimationFrame(this.rid)
		let { COUNT } = this.$actions
		let count = () => {
			let state = this.props.count
			switch (true) {
				case state > num:
					COUNT('DECREMENT')
					break
				case state < num:
					COUNT('INCREMENT')
					break
				case state === num:
					return callback && callback()
			}
			this.rid = requestAnimationFrame(count)
		}
		count()
	}
	render() {
		let { COUNT } = this.$actions
		let { count } = this.props
		let getNum = e => {
			let num = parseInt(this.refs.input.getDOMNode().value, 10)
			if (typeof num === 'number') {
				this.toNum(num)
			}
		}
		return (
			<div>
				<span ref={ count % 2 ? "counter" : null }>count: { count }</span>
				{' '}
				<button onClick={ () => COUNT('INCREMENT') }>+</button>
				{' '}
				<button onClick={ () => COUNT('DECREMENT') }>-</button>
				{' '}
				<button onClick={ () => COUNT('INCREMENT_IF_ADD') }>incrementIfOdd</button>
				{' '}
				<input type="text" ref="input" />
				<button onClick={ getNum }>run</button>
			</div>
		)
	}
}