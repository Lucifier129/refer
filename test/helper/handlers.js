import { ADD_ITEM, DELETE_ITEM, DELETE_ITEMS, UPDATE_ITEM, UPDATE_ITEMS } from './constants'

let addItem = text => {
	let date = new Date()
	let time = date.getTime()
	return {
		id: time + Math.random().toString(36).substr(2),
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
	[ADD_ITEM]: item => state => {
		return {
			...state,
			todos: [item, ...state.todos]
		}
	},
	[DELETE_ITEM]: query => state => {
		return {
			...state,
			todos: filterItems(query, state.todos)
		}
	},
	[DELETE_ITEMS]: DELETE_ITEM,
	[UPDATE_ITEM]: source => state => {
		return {
			...state,
			todos: updateItem(source, state.todos)
		}
	},
	[UPDATE_ITEMS]: source => state => {
		return {
			...state,
			todos: state.todos.map(item => Object.assign({}, item, source))
		}
	}
}

export default [collector, transformer]