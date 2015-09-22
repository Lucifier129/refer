import store from './store'
import View  from './view'
import React, { Component } from 'react'
import { combineDispatches } from 'refer'

export default class Header extends Component {
	render() {
		let { props } = this
		let dispatch = combineDispatches(props.dispatch, store.dispatch)
		let record = header => {
			console.time('header')
			dispatch('RECORD', header)
			console.timeEnd('header')
		}
		return <View record={ record } />
	}
}