import { createStore } from 'refer'
import * as handlers from '../handlers'

let store = createStore(handlers, 0)

export default store