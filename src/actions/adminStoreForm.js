import * as ActionTypes from '../constants/actionTypes'

export const editForm = formFieldsChange => ({
  type: ActionTypes.ADMINSTOREFORM_EDITFORM_CHANGE,
  field: formFieldsChange,
})
