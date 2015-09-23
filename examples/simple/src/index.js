import React from 'react'
import App from './container/app'
import store from './store'

import * as Refer from 'refer'
console.log(Refer)

React.render(
	<App dispatch={ store.dispatch } />, 
	document.getElementById('container')
)