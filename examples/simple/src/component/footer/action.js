export let record = footer => state => {
	return {
		...state,
		footer: [footer, ...state.footer]
	}
}