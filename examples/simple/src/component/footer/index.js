import createStore from './store'
import View  from './view'
import React, { Component } from 'react'
import { combineDispatches } from 'refer'

let store = createStore()

export default class Footer extends Component {
	render() {
		let { props } = this
		let dispatch = combineDispatches(props.dispatch, store.dispatch)
		let record = footer => {
			dispatch('RECORD', footer)
		}
		return <View record={ record } />
	}
}