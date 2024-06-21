const INITIAL_STATE = {
  usersData: [],
  isLoading: false,
  isError: false,
  errorMsg: ""
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "REQUEST_USERS_DATA":
      return {
        ...state,
        isLoading: true,
        isError: false,
        errorMsg: ""
      };
    case "RECEIVE_USERS_DATA":
      return {
        ...state,
        usersData: action.usersData,
        isLoading: false,
        isError: action.isError,
        errorMsg: action.errorMsg
      };
    default:
      return state;
  }
}