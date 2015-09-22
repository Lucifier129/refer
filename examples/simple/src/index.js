import React from 'react'
import App from './container/app'
import store from './store'

React.render(
	<App dispatch={ store.dispatch } />, 
	document.getElementById('container')
)