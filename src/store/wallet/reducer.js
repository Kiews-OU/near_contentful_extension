let walletState = {
  walletID: "",
  walletSum: "",
  sum: "",
  rid: ""
};
export const walletReducer = (state = walletState, option) => {
  switch (option.type) {
    case "setdata":
      state.walletID = option.id
      state.walletSum = option.available
      return state
    case "enterval":
      state[option.key] = option.data
    default:
      return state;
  }
};

