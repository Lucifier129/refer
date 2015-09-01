import { ADD_ITEM, DELETE_ITEM, DELETE_ITEMS, UPDATE_ITEM, UPDATE_ITEMS } from './constants'

let addItem = text => {
	let date = new Date()
	let time = date.getTime()
	return {
		id: time,
		addTime: time,
		updateTime: time,
		diplayTime: date.toLocaleString(),
		status: false,
		text
	}
}

let updateItem = ({ id, ...other }, state) => {
	let date = new Date()
	return state.map(item =>
		item.id === id ?
		Object.assign({}, item, other, {
			updateTime: date.getTime(),
			displayTime: date.toLocaleString()
		}) :
		item
	)
}

let filterItems = (query, state) => {
	return state.filter(
		item => Object.keys(query).some(key => item[key] !== query[key])
	)
}


let collector = {
	[ADD_ITEM]: addItem,
	[DELETE_ITEM]: id => ({ id })
}

let transformer = {
	[ADD_ITEM]: item => getState => {
		let state = getState()
		return {
			...state,
			todos: [item, ...state.todos]
		}
	},
	[DELETE_ITEM]: query => getState => {
		let state = getState()
		return {
			...state,
			todos: filterItems(query, state.todos)
		}
	},
	[DELETE_ITEMS]: DELETE_ITEM,
	[UPDATE_ITEM]: source => getState => {
		let state = getState()
		return {
			...state,
			todos: updateItem(source, state.todos)
		}
	},
	[UPDATE_ITEMS]: source => getState => {
		let state = getState()
		return {
			...state,
			todos: state.todos.map(item => Object.assign({}, item, source))
		}
	}
}

export default [collector, transformer]