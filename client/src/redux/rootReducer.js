import { combineReducers } from 'redux'

import authReducer from './reducers/authReducer'
import alertReducer from './reducers/alertReducer'
import inventoryReducer from './reducers/inventoryReducer'
import profileReducer from './reducers/profileReducer'
import cartReducer from './reducers/cartReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  inventory: inventoryReducer,
  profile: profileReducer,
  cart: cartReducer
})

export default rootReducer
