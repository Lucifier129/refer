import React, { Component } from 'react'
import { RECORD } from './constant'

let getView = Input => class View extends Component {
	render() {
		let { dispatch } = this
		return <Input dispatch={ dispatch } />
	}
}

export default getView