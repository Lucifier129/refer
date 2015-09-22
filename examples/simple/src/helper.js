import React, { Component } from 'react'
import { combineDispatches, types } from 'refer'

let { isFn } = types

export let connect = store => Component => {
	return class Facade extends Component {
		constructor(props, context) {
			super(props, context)
			this.store = store
		}
		get dispatch() {
			let { dispatch } = this.props
			return isFn(dispatch) ? combineDispatches(dispatch, store.dispatch) : store.dispatch
		}
	}
}