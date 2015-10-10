import React from 'react'
import App from './container/App'

React.render(
	<App />, 
	document.getElementById('container')
)

document.getElementById('container').appendChild(document.createTextNode('abc'))


//setTimeout(() => React.unmountComponentAtNode(document.getElementById('container')), 2000)