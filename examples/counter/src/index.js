import React from 'react'
import App from './container/App'

class Facade extends App {
	render() {
		var data = super.render()
		debugger
		return data
	}
	componentWillMount() {
		debugger
	}
}

React.render(
	<Facade />, 
	document.getElementById('container')
)


//setTimeout(() => React.unmountComponentAtNode(document.getElementById('container')), 2000)