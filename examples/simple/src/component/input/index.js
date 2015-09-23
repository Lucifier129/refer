import createStore from './store'
import View  from './view'
import { connect } from 'refer'

export default connect(createStore)(View)