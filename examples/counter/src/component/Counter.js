import React, { Component } from 'react'
export default class Counter extends Component {
	render() {
		let { count, increment, decrement, incrementIfOdd } = this.props
		return (
			<div>
				<span>count: { count }</span>
				{' '}
				<button onClick={ increment }>+</button>
				{' '}
				<button onClick={ decrement }>-</button>
				{' '}
				<button onClick={ incrementIfOdd }>incrementIfOdd</button>
			</div>
		)
	}
}