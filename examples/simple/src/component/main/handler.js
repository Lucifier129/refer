import { RECORD } from './constant'

export default {
	[RECORD]: main => state => {
		return {
			...state,
			main: main
		}
	}
}