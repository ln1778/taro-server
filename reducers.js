export const initialResponse = { response: null, error: null, loading: false };

export const actions = {
  init: 'init',
  success: 'success',
  fail: 'fail',
};

export function responseReducer(state, action) {
  switch (action.type) {
    case actions.init:
      return { response: {data:null}, error: null, loading: true };
    case actions.success:
      return { response: action.payload,data:action.payload.data?action.payload.data:{},error: null, loading: false };
    case actions.fail:
      return { response: null,data:action.payload.data?action.payload.data:{}, error: action.payload, loading: false };
    default:
      return initialResponse;
  }
}