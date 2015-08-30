import createDispatche from './createDispatche'
import mapValues from './mapValues'

export default function combineReducers(...reducerList) {
	let dispatcheList = reducerList.map(createDispatche)
	let reducer = mapValues(reducerList[0], (_, key) =>
		dispatcheList.map(dispatche => value => dispatche(key, value))
	)
	return createDispatche(reducer)
}