import React, { Component } from 'react'
export default class Counter extends Component {
	render() {
		let { COUNT } = this.actions
		let { count } = this.props
		return (
			<div>
				<span>count: { count }</span>
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