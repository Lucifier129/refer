import createStore from './store'
import View  from './view'
import { connect } from 'react-refer'

export default connect(createStore)(View)