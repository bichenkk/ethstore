import * as ActionTypes from '../constants/actionTypes'

export const editForm = formFieldsChange => ({
  type: ActionTypes.STOREOWNERSTOREFORM_EDITFORM_CHANGE,
  field: formFieldsChange,
})
