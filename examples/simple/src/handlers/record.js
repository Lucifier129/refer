import { createHandler } from 'refer'

export default createHandler([])
.then(
	text => state => ({
		...state,
		text: [...state.text, text]
	})
)