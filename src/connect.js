import combineDispatches from './combineDispatches'
import { isFn } from './types'

export default createStore => Component => {
	return class Facade extends Component {
		constructor(props, context) {
			super(props, context)
			this.store = createStore()
		}
		get dispatch() {
			let { store, props } = this
			let { dispatch } = props
			return isFn(dispatch) ? combineDispatches(dispatch, store.dispatch) : store.dispatch
		}
	}
}