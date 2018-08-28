import * as ActionTypes from '../constants/actionTypes'

export const editForm = formFieldsChange => ({
  type: ActionTypes.STOREOWNERPRODUCTFORM_EDITFORM_CHANGE,
  field: formFieldsChange,
})
