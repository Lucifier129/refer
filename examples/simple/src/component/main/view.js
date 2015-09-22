import React, { Component } from 'react'
import { RECORD } from './constant'
import Input from '../input'
export default class View extends Component {
	render() {
		let { dispatch } = this
		return <div id="main"><Input value="" dispatch={ dispatch } /></div>
	}
}