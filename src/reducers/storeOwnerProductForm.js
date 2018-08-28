import { STOREOWNERPRODUCTFORM_EDITFORM_CHANGE } from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case STOREOWNERPRODUCTFORM_EDITFORM_CHANGE:
      return {
        ...state,
        formFieldValues: { ...state.formFieldValues, ...action.field },
      }
    default:
      return state
  }
}
