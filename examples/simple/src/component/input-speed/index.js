import createStore from './store'
import getView  from './view'
import { connect } from 'refer'
import Input from '../input'

let doConnect = times => {
	let View = Input
	for (var i = 0; i < times; i++) {
		View = connect(createStore)(getView(View))
	}
	return View
}

export default doConnect(100) //性能测试