import React, { Component } from 'react'
import { combineDispatches, types } from 'refer'

let { isFn } = types

export let connect = createStore => Component => {
	return class Facade extends Component {
		constructor(props, context) {
			super(props, context)
			this.store = createStore()
		}
		get dispatch() {
			let { store } = this
			let { dispatch } = this.props
			return isFn(dispatch) ? combineDispatches(dispatch, store.dispatch) : store.dispatch
		}
	}
}