import { STOREOWNERSTOREFORM_EDITFORM_CHANGE } from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case STOREOWNERSTOREFORM_EDITFORM_CHANGE:
      return {
        ...state,
        formFieldValues: { ...state.formFieldValues, ...action.field },
      }
    default:
      return state
  }
}
