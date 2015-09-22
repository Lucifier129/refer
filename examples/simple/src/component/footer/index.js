import store from './store'
import View  from './view'
import React, { Component } from 'react'
import { combineDispatches } from 'refer'

export default class Footer extends Component {
	render() {
		let { props } = this
		let dispatch = combineDispatches(props.dispatch, store.dispatch)
		let record = footer => {
			console.time('footer')
			dispatch('RECORD', footer)
			console.timeEnd('footer')
		}
		return <View record={ record } />
	}
}