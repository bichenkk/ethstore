import { combineReducers } from 'redux'
import { drizzleReducers } from 'drizzle'
import adminStoreForm from './adminStoreForm'
import storeOwnerStoreForm from './storeOwnerStoreForm'
import storeOwnerProductForm from './storeOwnerProductForm'

export default combineReducers({
  adminStoreForm,
  storeOwnerStoreForm,
  storeOwnerProductForm,
  ...drizzleReducers,
})
