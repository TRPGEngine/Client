import {
  EXAMPLE
} from '../constants'

function example(val){
  return {
    type: EXAMPLE,
    payload: {
      title: val
    }
  }
}

export function changeTitle(val){
  return (dispatch, getState) => {
    dispatch(example(val))
  }
}
