import createStore from './store'
import View  from './view'
import React, { Component } from 'react'
import { combineDispatches } from 'refer'

let store = createStore()

export default class Header extends Component {
	render() {
		let { props } = this
		let dispatch = combineDispatches(props.dispatch, store.dispatch)
		let record = header => {
			dispatch('RECORD', header)
		}
		return <View record={ record } />
	}
}