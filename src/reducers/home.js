import {
  HOME_EDITFORM_CHANGE,
  HOME_SETVARIABLE_LOAD,
  HOME_SETVARIABLE_SUCCEED,
  HOME_SETVARIABLE_FAIL,
} from '../constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_EDITFORM_CHANGE:
      return {
        ...state,
        formFieldValues: { ...state.formFieldValues, ...action.field },
      }
    case HOME_SETVARIABLE_LOAD:
      return {
        ...state,
        isEditItemLoading: true,
        isEditItemSuccess: false,
        editItemError: null,
      }
    case HOME_SETVARIABLE_SUCCEED:
      return {
        ...state,
        isEditItemLoading: false,
        isEditItemSuccess: true,
        editItemTransaction: action.transaction,
        formFieldValues: {},
      }
    case HOME_SETVARIABLE_FAIL:
      return {
        ...state,
        isEditItemLoading: false,
        editItemError: action.editItemError,
      }
    default:
      return state
  }
}
