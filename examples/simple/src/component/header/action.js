export let record = header => state => {
	return {
		...state,
		header: [header, ...state.header]
	}
}