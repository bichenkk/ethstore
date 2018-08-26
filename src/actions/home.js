import * as ActionTypes from '../constants/actionTypes'

export const keys = [
  'myVariable',
]

export const editForm = formFieldsChange => ({
  type: ActionTypes.HOME_EDITFORM_CHANGE,
  field: formFieldsChange,
})

export const setVariable = (contract, value) => async (dispatch) => {
  dispatch({ type: ActionTypes.HOME_SETVARIABLE_LOAD })
  try {
    const transaction = await contract.methods.set(value).send()
    dispatch({ type: ActionTypes.HOME_SETVARIABLE_SUCCEED, transaction })
  } catch (error) {
    dispatch({
      type: ActionTypes.HOME_SETVARIABLE_FAIL,
      editItemError: error,
    })
  }
}
